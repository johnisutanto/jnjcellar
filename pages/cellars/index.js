import { executeSql, getWineFilters } from "../../utils/connectDb"
import {
  Box,
  Card,
  Grid,
  Text,
  CardHeader,
  Header,
  Select,
} from "grommet"
import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { useMsal } from "@azure/msal-react"

const HoverableCard = styled(Card)`
  &:hover {
    background-color: #dcdcdc;
    cursor: pointer;
  }
`

export default function Home({ wines, filters }) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentWines, setCurrentWines] = useState(wines)

  const { instance } = useMsal()
  console.log(`the filters are ${JSON.stringify(filters)}`)

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }
  const wineColorOptions = ["Red", "White", "Rose"]
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })
  const handleSearch = async () => {
    const params = {}
    const colorIndex = wineColorOptions.findIndex(
      (color) => color === selectedColor
    )
    if (colorIndex !== -1) {
      params.Color = colorIndex
    }
    if (selectedCountry) {
      params.Country = `'${selectedCountry}'`
    }
    axios.post("/api/search", params).then((res) => {
      setCurrentWines(res.data)
    })
  }
  useEffect(() => {
    if (!selectedColor && !selectedCountry) return
    handleSearch()
  }, [selectedColor, selectedCountry])
  const handleColorChange = ({ option }) => {
    setSelectedColor(option)
  }
  const handleCountryChange = ({ option }) => {
    setSelectedCountry(option)
  }

  return (
    <>
      {/* <Header
        pad="medium"
        background="url('https://wineimages.blob.core.windows.net/images/Cellar.png')"
        height="200px"
      >
        <Box align="center" fill="horizontal">
          <div
            style={{
              fontFamily: "GermanFont",
              fontSize: isMobile ? 50 : 100,
              color: "white",
              textShadow:
                "-3px 3px 0 #58181F, 3px 3px 0 #58181F, 3px -3px 0 #58181F, -3px -3px 0 #58181F",
            }}
          >
            J&J Cellars
          </div>
        </Box>
      </Header> */}
      <Box direction="row" pad="large" gap="large">
        <Select
          id="select-color"
          name="select-color"
          placeholder="Wine Color"
          value={selectedColor}
          options={wineColorOptions}
          onChange={handleColorChange}
        />
        <Select
          id="select-country"
          name="select-country"
          placeholder="Country"
          value={selectedCountry}
          options={filters}
          onChange={handleCountryChange}
        />
      </Box>
      <Box pad="large" fill>
        <Grid columns={isMobile ? "100%" : "small"} gap="large">
          {(currentWines || []).map((wine, index) => (
            <Link href={`/wine/${wine.Id}`} key={`card-wine-${wine.Id}`}>
              <HoverableCard
                pad="none"
                key={index}
                elevation="none"
                border={{
                  color: "#dcdcdc",
                }}
              >
                <CardHeader pad="xsmall">
                  <Box pad="none" align="end" fill="horizontal">
                    {/* {wine.location.split("|").map(loc => loc.trim()).map(loc => (
                        <Text size="xsmall">{loc}</Text>
                      ))} */}
                    <Box
                      pad="xsmall"
                      background={{
                        color: "#58181F",
                      }}
                      border
                    >
                      <Text size="xsmall" color="white">
                        {wine.Rating}
                      </Text>
                    </Box>
                  </Box>
                </CardHeader>
                <Box align="center" pad="small">
                  <img
                    src={wine.ImageUrl}
                    height={150}
                    alt={`img-wine-${wine.Id}`}
                  />
                  <Box
                    height="50px"
                    margin={{
                      top: "10px",
                    }}
                  >
                    <Text size="medium" textAlign="center">
                      {wine.Name}
                    </Text>
                  </Box>
                  <Text size="small" truncate>
                    {wine.Producer}
                  </Text>
                  <Text size="small">
                    {wine.Vintage} | {wine.Country}
                  </Text>
                </Box>
              </HoverableCard>
            </Link>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export async function getServerSideProps(context) {
  const wines = await executeSql()
  const filters = await getWineFilters()

  return {
    props: { wines, filters },
  }
}
