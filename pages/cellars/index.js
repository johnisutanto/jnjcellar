import { executeSql, getWineFilters } from "../../utils/connectDb"
import {
  Accordion,
  AccordionPanel,
  Box,
  Card,
  Grid,
  Text,
  CardHeader,
  Button,
  Select,
} from "grommet"
import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import useQueryState from "../../utils/useQueryState"
import usePrevious from "../../utils/usePrevious"
import { isEqual, isNil } from "lodash"

const HoverableCard = styled(Card)`
  &:hover {
    background-color: #dcdcdc;
    cursor: pointer;
  }
`

const FiltersContainer = styled.div`
  margin: 0 32px;
  & button {
    margin: 10px;
  }
`
const DEFAULT_FILTERS = {
  country: null,
  color: null,
  region: null,
  varietal: null,
}

export default function Home({ wines, filters }) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentWines, setCurrentWines] = useState(wines)
  const [wineFilters, setWineFilters] = useQueryState(DEFAULT_FILTERS)
  const prevWineFilters = usePrevious(wineFilters)

  const noFilters = Object.values(wineFilters).every(filter => isNil(filter))
  // console.log(`the filters are ${JSON.stringify(filters)}`)
  console.log(`the wineFilter = ${JSON.stringify(wineFilters)}`)
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }
  const wineColorOptions = ["Red", "White", "Rose"]
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })
  const handleSearch = async () => {
    const params = {}
    const colorIndex = wineColorOptions.findIndex(
      (color) => color === wineFilters.color
    )
    if (colorIndex !== -1) {
      params.Color = colorIndex
    }
    if (wineFilters.country) {
      params.Country = `'${wineFilters.country}'`
    }
    if (wineFilters.region) {
      params.Region = `'${wineFilters.region}'`
    }
    if (wineFilters.varietal) {
      params.Varietal = `'${wineFilters.varietal}'`
    }
    console.log(`we are calling with ${JSON.stringify(params)}`)
    axios.post("/api/search", params).then((res) => {
      setCurrentWines(res.data)
    })
  }
  useEffect(() => {
    if (!isEqual(prevWineFilters, wineFilters)) {
      handleSearch()
    }
  }, [prevWineFilters, wineFilters])
  const handleWineFilter =
    (filterName) =>
    ({ option }) => {
      setWineFilters({
        ...wineFilters,
        [filterName]: option,
      })
    }
  const clearAllFilters = () => {
    setWineFilters(DEFAULT_FILTERS)
  }

  return (
    <>
      <Accordion>
        <AccordionPanel label={`Wine Filters ${noFilters ? "" : "(filtered)"}`}>
          <FiltersContainer>
            <Select
              id="select-color"
              name="select-color"
              placeholder="Wine Color"
              value={wineFilters.color}
              options={wineColorOptions}
              onChange={handleWineFilter("color")}
            />
            <Select
              id="select-country"
              name="select-country"
              placeholder="Country"
              value={wineFilters.country}
              options={filters.countries}
              onChange={handleWineFilter("country")}
            />
            <Select
              id="select-region"
              name="select-region"
              placeholder="Region"
              value={wineFilters.region}
              options={filters.regions}
              onChange={handleWineFilter("region")}
            />
            <Select
              id="select-varietal"
              name="select-varietal"
              placeholder="Varietal"
              value={wineFilters.varietal}
              options={filters.varietals}
              onChange={handleWineFilter("varietal")}
            />
            <Button label="Clear All" onClick={clearAllFilters} primary />
          </FiltersContainer>
        </AccordionPanel>
      </Accordion>

      {/* </Box> */}
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
