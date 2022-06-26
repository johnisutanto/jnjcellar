import React, { useState } from 'react';
import {
  Box, Heading, Text, Button, Layer,
} from 'grommet';
import { getWine } from '../../utils/connectDb';
import { WINE_COLUMNS } from "../../model/wine"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"


const WineRemover = styled.div`
  // display: flex;
  &:hover{
    cursor: pointer;
  }
  div {
    position: relative;
    top: 115px;
    left: 25px;
    color: white;
  }
`

const Property = ({ name, value }) => (
  <Box direction="row-responsive" gap="small">
    <Box width="small">
      <Text>
        {name}
      </Text>
    </Box>
    <Text>
      <strong>
        {value}
      </strong>
    </Text>
  </Box>
)

const EXCLUDED_COLUMNS = ["Id", "ImageUrl", "Location"]
const Wine = ({ wine }) => {
  const [currentWine, setCurrentWine] = useState(wine);
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null)
  const location = currentWine.Location.split("|").map(loc => loc.trim())
  const onClose = () => setOpen(false);
  const onOpen = (loc) => () => {
    setSelectedLocation(loc)
    setOpen(true);
  }

  const handleRemoveWine = async () => {
    console.log(`Removing ${selectedLocation}`)
    const newValue = location.filter(loc => loc !== selectedLocation)
    console.log(`After removal: ${newValue}`)

    axios.post("/api/updateWine", {
      id: wine.Id,
      location: newValue,
    }).then(res => {
      console.log(`new wine is ${JSON.stringify(res)}`)
      setCurrentWine(res.data)
    })

  }
  const RemoveDialog = () => (
    <Layer
      id="remove-wine"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
    >
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          Confirm
        </Heading>
        <Text>This will remove wine from your inventory. Do you want to proceed?</Text>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="No" onClick={onClose} color="dark-3" />
          <Button
            label={
              <Text color="white">
                <strong>Yes</strong>
              </Text>
            }
            onClick={() => {
              handleRemoveWine();
              onClose();
            }}
            primary
            color="status-critical"
          />
        </Box>
      </Box>
    </Layer>
  )
  return (
    <>
      <Link href="/">
        Back to home page
      </Link>
      <Box pad="medium">
        <Box
          direction="row"
          justify="between"
          align="center"
          gap="small"
          style={{ marginBottom: "60px" }}
        >
          <Heading style={{ textAlign: "end", width: "100%" }}>
            {currentWine.Vintage} {currentWine.Name}
          </Heading>
        </Box>
        <Box
          direction="row-responsive"

          gap="small"
        >
          <Box
            width="50%"
            align='center'
          >
            <img src={wine.ImageUrl} height={500} alt={`wine-pic-${wine.Id}`} />
          </Box>

          <Box
            gap="medium"
            margin={{ bottom: 'large' }}
          >
            {WINE_COLUMNS.filter(col => !EXCLUDED_COLUMNS.includes(col.name)).map(col => (<Property
              name={col.name}
              value={col.transform ? col.transform(currentWine[col.name]) : currentWine[col.name]}
              key={`column-${col}`}
            />))}
            <Box direction="row-responsive" gap="small">
              <Box width="small">
                <Text>
                  Location
                </Text>
              </Box>
              <Box direction='row-responsive'>
                {location.map(loc => loc.trim()).map(loc => <WineRemover onClick={onOpen(loc)} key={`wine-remover-${loc}`}>
                  <div>{loc}</div>
                  <img src="/bottle.png" width={70} alt={`wine-bottle-${loc}`} />
                </WineRemover>)}
              </Box>
            </Box>
          </Box>
        </Box>
        {open && <RemoveDialog />}
      </Box>
    </>

  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const wine = await getWine(id)

  return {
    props: { wine },
  }
}

export default Wine
