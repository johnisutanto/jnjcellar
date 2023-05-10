import React, { FC, useState } from "react"
import {
  TextInput,
  NumberInput,
  Container,
  Grid,
  Select,
  MultiSelect,
  Button,
  Title,
  Center,
  Space,
  Modal,
  Group,
  Text,
  InputBase,
  useMantineTheme,
} from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import InputMask from "react-input-mask"
import { IconCurrencyDollar, IconPercentage } from "@tabler/icons-react"
import { noop } from "lodash"
import { WineColors } from "../../shared/common"

type Mode = "add" | "edit"

interface WineFormProps {
  title: string
  filters: any
  form: any
  onSubmit: any
  onSuccess: any
  showSuccessModal: boolean
  mode: Mode
}

const WineForm: FC<WineFormProps> = ({
  title,
  filters,
  form,
  onSubmit,
  onSuccess,
  showSuccessModal,
  mode,
}) => {
  const [countryOptions, setCountryOptions] = useState(filters.countries)
  const [regionOptions, setRegionOptions] = useState(filters.regions)
  const [producerOptions, setProducerOptions] = useState(filters.producers)
  const [appellationOptions, setAppellationOptions] = useState(
    filters.appellations
  )
  const [varietalOptions, setVarietalOptions] = useState(filters.varietals)
  const theme = useMantineTheme()

  return (
    <>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={showSuccessModal}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
        title={
          <Text size="md" color="pink" weight={700}>
            Yay!!!!
          </Text>
        }
        onClose={noop}
      >
        Wine has been {mode === "add" ? "added" : "updated"} successfully
        <Space h="xl" />
        <Group position="right">
          <Button onClick={onSuccess}>OK</Button>
        </Group>
      </Modal>
      <form
        autoComplete="off"
        role="presentation"
        autoCorrect="off"
        spellCheck="false"
        onSubmit={form.onSubmit((values) => onSubmit(values))}
      >
        <Space h="xl" />
        <Center>
          <Title order={2}>{title}</Title>
        </Center>
        <Container my="md">
          <Grid>
            <Grid.Col xs={8}>
              <TextInput
                label="Name"
                {...form.getInputProps("name")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Select
                id="select-color"
                name="select-color"
                placeholder="Color"
                label="Color"
                data={WineColors}
                {...form.getInputProps("color")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Select
                id="select-country"
                name="select-country"
                placeholder="Country"
                label="Country"
                data={countryOptions}
                searchable
                creatable
                onCreate={(query) => {
                  setCountryOptions((current) => [...current, query])
                  form.setFieldValue("country", query)
                }}
                getCreateLabel={(query) => `+ Create ${query}`}
                role="presentation"
                autoCorrect="off"
                spellCheck="false"
                {...form.getInputProps("country")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Select
                id="select-region"
                name="select-region"
                placeholder="Region"
                label="Region"
                data={regionOptions}
                searchable
                creatable
                onCreate={(query) => {
                  setRegionOptions((current) => [...current, query])
                  form.setFieldValue("region", query)
                }}
                getCreateLabel={(query) => `+ Create ${query}`}
                role="presentation"
                autoCorrect="off"
                spellCheck="false"
                {...form.getInputProps("region")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Select
                id="select-producer"
                name="select-producer"
                placeholder="Producer"
                label="Producer"
                data={producerOptions}
                searchable
                creatable
                onCreate={(query) => {
                  setProducerOptions((current) => [...current, query])
                  form.setFieldValue("producer", query)
                }}
                getCreateLabel={(query) => `+ Create ${query}`}
                {...form.getInputProps("producer")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <Select
                id="select-appellation"
                name="select-appellation"
                placeholder="Appellation"
                label="Appelation"
                data={appellationOptions}
                onCreate={(query) => {
                  setAppellationOptions((current) => [...current, query])
                  form.setFieldValue("appellation", query)
                }}
                getCreateLabel={(query) => `+ Create ${query}`}
                searchable
                creatable
                {...form.getInputProps("appellation")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={8}>
              <MultiSelect
                label="Varietal"
                data={varietalOptions}
                placeholder="Varietal"
                searchable
                creatable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  setVarietalOptions((current) => [...current, query])
                  form.setFieldValue("varietal", [
                    ...form.values.varietal,
                    query,
                  ])
                }}
                {...form.getInputProps("varietal")}
                required
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <NumberInput
                label="Vintage"
                {...form.getInputProps("vintage")}
                required
                min={1990}
                max={new Date().getFullYear()}
                hideControls
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <NumberInput
                label="Price"
                {...form.getInputProps("price")}
                icon={<IconCurrencyDollar size={16} />}
                hideControls
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <NumberInput
                label="Alcohol"
                {...form.getInputProps("alcoholPct")}
                rightSection={<IconPercentage size={16} />}
                min={0}
                max={100}
                hideControls
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <NumberInput
                label="Rating"
                {...form.getInputProps("rating")}
                min={0}
                max={100}
                hideControls
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <InputBase
                label="Drink Date"
                {...form.getInputProps("drinkDate")}
                placeholder="Drink date range"
                component={InputMask}
                mask="9999 - 9999"
              />
            </Grid.Col>
            <Grid.Col xs={6}>
              <DatePicker
                placeholder="Pick date"
                label="Date acquired"
                {...form.getInputProps("dateAcquired")}
              />
            </Grid.Col>
            <Grid.Col xs={8}>
              <TextInput
                label="Image URL"
                {...form.getInputProps("imageUrl")}
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Select
                id="select-maturity"
                name="select-maturity"
                placeholder="Maturity"
                label="Maturity"
                data={filters.maturity}
                {...form.getInputProps("maturity")}
                required
              />
            </Grid.Col>
          </Grid>
        </Container>
        <Space h="xl" />
        <Container my="md">
          <Center>
            <Button variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Space w="lg" />
            <Button type="submit">Submit</Button>
          </Center>
        </Container>
      </form>
    </>
  )
}

export default WineForm
