import { useState, useEffect } from "react"
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  MaskedInput,
  RadioButtonGroup,
  RangeInput,
  Select,
  TextArea,
  TextInput,
} from "grommet"
import { getWineFilters } from "../../utils/connectDb"
import DropDown from "../../components/DropDown"

export default function AddWine({ filters }) {
  const [countryOptions, setCountryOptions] = useState(filters.countries)
  const [regionOptions, setRegionOptions] = useState(filters.regions)
  const [producerOptions, setProducerOptions] = useState(filters.producers)
  const [appellationOptions, setAppellationOptions] = useState(filters.appellations)
  const [varietalOptions, setVarietalOptions] = useState(filters.varietals)

  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [producer, setProducer] = useState("")
  const [appellation, setAppellation] = useState("")
  const [vintage, setVintage] = useState("")
  const [color, setColor] = useState("")
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [alcoholPct, setAlcoholPct] = useState("")
  const [rating, setRating] = useState("")
  const [varietal, setVarietal] = useState([])

  useEffect(() => {
    console.log(`the value of countryOptions ${countryOptions}`)
  }, [countryOptions])

  return (
    <Box fill="horizontal" align="center" justify="center">
      <Box width="large">
        <Form
          autocomplete="off"
          onChange={(value) => console.log("Change", value)}
          onReset={() => {
            setName("")
            setCountry("")
            setRegion("")
            setProducer("")
            setColor("")
            setAppellation("")
            setVintage("")
          }}
          onSubmit={(event) =>
            console.log("Submit", event.value, event.touched)
          }
        >
          <FormField label="Name" name="name">
            <TextInput
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autocomplete="off"
              role="presentation"
            />
          </FormField>
          <FormField label="Country" name="country">
            <DropDown
              options={countryOptions}
              selectedOption={country}
              onSelect={(value, isNew) => {
                if (isNew) {
                  setCountryOptions([...countryOptions.slice(0, countryOptions.length - 1), value])
                }
                setCountry(value); 
              }}
            />
          </FormField>
          <FormField label="Region" name="region">
            <DropDown
              options={regionOptions}
              selectedOption={region}
              onSelect={(value, isNew) => {
                if (isNew) {
                  setRegionOptions([...regionOptions.slice(0, regionOptions.length - 1), value])
                }
                setRegion(value); 
              }}
            />
          </FormField>
          <FormField label="Producer" name="producer">
            <DropDown
              options={producerOptions}
              selectedOption={producer}
              onSelect={(value, isNew) => {
                if (isNew) {
                  setRegionOptions([...producerOptions.slice(0, producerOptions.length - 1), value])
                }
                setProducer(value); 
              }}
            />
          </FormField>
          <FormField label="Appellation" name="appellation">
            <DropDown
              options={appellationOptions}
              selectedOption={appellation}
              onSelect={(value, isNew) => {
                if (isNew) {
                  setAppellationOptions([...appellationOptions.slice(0, appellationOptions.length - 1), value])
                }
                setAppellation(value); 
              }}
            />
          </FormField>
          <FormField label="Vintage" name="vintage">
            <TextInput
              name="vintage"
              value={vintage}
              onChange={(event) => setVintage(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <FormField name="color" label="Color">
            <RadioButtonGroup
              name="color"
              options={["Red", "White", "Rose"]}
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </FormField>
          <FormField label="Varietal" name="varietal" size="small">
            <DropDown
              options={varietalOptions}
              selectedOption={varietal}
              multiple={true}
              onSelect={(value, isNew) => {
                if (isNew) {
                  setVarietalOptions([...varietalOptions.slice(0, varietalOptions.length - 1), value])
                }
                setVarietal(value); 
              }}
            />
          </FormField>
          <FormField label="Price" name="price">
            <TextInput
              name="price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <FormField label="Alcohol %" name="alcoholPct">
            <TextInput
              name="alcoholPct"
              value={alcoholPct}
              onChange={(event) => setAlcoholPct(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <FormField label="Rating" name="rating">
            <TextInput
              name="rating"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <FormField label="Location" name="location">
            <TextInput
              name="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <FormField label="Image URL" name="imageUrl">
            <TextInput
              name="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              autocomplete="off"
            />
          </FormField>
          <Box direction="row" justify="between" margin={{ top: "medium" }}>
            <Button label="Cancel" />
            <Button type="reset" label="Reset" />
            <Button type="submit" label="Add" primary />
          </Box>
        </Form>
      </Box>
    </Box>
  )
}



export async function getServerSideProps(context) {
  const filters = await getWineFilters()

  return {
    props: { filters },
  }
}

