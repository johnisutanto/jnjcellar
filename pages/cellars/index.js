import { getWines, getWineFilters } from "../../utils/connectDb"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import useQueryState from "../../utils/useQueryState"
import usePrevious from "../../utils/usePrevious"
import { isEqual, isNil } from "lodash"
import {
  Box,
  Card,
  Image,
  Text,
  Center,
  Pagination,
  Group,
  createStyles,
  Space,
  Select,
  Container,
  Badge,
  Grid,
} from "@mantine/core"
import { AuthenticatedTemplate } from "@azure/msal-react"

const DEFAULT_FILTERS = {
  country: null,
  color: null,
  region: null,
  varietal: null,
}

const useStyles = createStyles((theme, _params, getRef) => ({
  rating: {
    color: "red",
    position: "absolute",
    right: 0,
    zIndex: 2,
    padding: 8,
  },
  bottleCount: {
    color: "black",
    fontSize: "small",
    position: "absolute",
    left: 0,
    zIndex: 2,
    padding: 8,
  },
}))

export default function Home({ wines, filters }) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentWines, setCurrentWines] = useState(wines.results)
  const [wineFilters, setWineFilters] = useQueryState(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const prevWineFilters = usePrevious(wineFilters)
  const prevCurrentPage = usePrevious(currentPage)
  const [totalPage, setTotalPage] = useState(Math.ceil(wines.totalCount / 15))

  const noFilters = Object.values(wineFilters).every((filter) => isNil(filter))
  console.log(`the filters are ${JSON.stringify(filters)}`)
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
    axios
      .post("/api/search", {
        q: params,
        page: currentPage - 1,
      })
      .then((res) => {
        setCurrentWines(res.data.results)
        setTotalPage(Math.ceil(res.data.totalCount / 15))
      })
  }
  useEffect(() => {
    if (!isEqual(prevWineFilters, wineFilters)) {
      handleSearch()
    }
  }, [prevWineFilters, wineFilters])
  useEffect(() => {
    if (!isEqual(prevCurrentPage, currentPage)) {
      handleSearch()
    }
  }, [prevCurrentPage, currentPage])
  const handleWineFilter = (filterName) => (option) => {
    setWineFilters({
      ...wineFilters,
      [filterName]: option,
    })
  }
  const clearAllFilters = () => {
    setWineFilters(DEFAULT_FILTERS)
  }
  const { classes } = useStyles()

  return (
    <>
      <Container fluid>
        <Space h="lg" />
        <Center>
          <Group>
            <Select
              clearable
              id="select-color"
              name="select-color"
              placeholder="Wine Color"
              data={wineColorOptions}
              value={wineFilters.color}
              onChange={handleWineFilter("color")}
            />
            <Select
              clearable
              id="select-country"
              name="select-country"
              placeholder="Country"
              value={wineFilters.country}
              data={filters.countries}
              onChange={handleWineFilter("country")}
            />
            <Select
              clearable
              id="select-region"
              name="select-region"
              placeholder="Region"
              value={wineFilters.region}
              data={filters.regions}
              onChange={handleWineFilter("region")}
            />
            <Select
              clearable
              id="select-varietal"
              name="select-varietal"
              placeholder="Varietal"
              value={wineFilters.varietal}
              data={filters.varietals}
              onChange={handleWineFilter("varietal")}
            />
          </Group>
        </Center>
      </Container>
      <Space h="xl" />
      <Space h="xl" />
      <Container fluid px="xl">
        <Grid>
          {(currentWines || []).map((wine, index) => (
            <Grid.Col sm={6} md={4} xl={2} lg={3} key={`card-wine-${wine.Id}`}>
              <Link href={`/wine/${wine.Id}`} passHref>
                <Card p="lg" component="a" radius="md" withBorder>
                  <Card.Section>
                    <div className={classes.rating}>
                      <Badge
                        size="lg"
                        radius="md"
                        color="white"
                        variant="outline"
                      >
                        {wine.Rating}
                      </Badge>
                    </div>
                    <div className={classes.bottleCount}>
                      <AuthenticatedTemplate>
                        Qty: {wine.BottleCount || 0}
                      </AuthenticatedTemplate>
                    </div>
                    <Image
                      src={wine.ImageUrl}
                      alt={wine.Name}
                      height={150}
                      fit="contain"
                      withPlaceholder
                      sx={{ paddingTop: 48 }}
                    />
                  </Card.Section>
                  <Space h="md" />
                  <Box sx={{ height: 50 }}>
                    <Text
                      size="lg"
                      align="center"
                      sx={(theme) => ({
                        color: theme.colors.pink[9],
                        lineHeight: "20px",
                      })}
                    >
                      {wine.Name}
                    </Text>
                  </Box>
                  <Text size="sm" align="center" lineClamp={1}>
                    {wine.Producer}
                  </Text>
                  <Text size="xs" align="center">
                    {wine.Vintage} | {wine.Country}
                  </Text>
                </Card>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
        <Space h="xl" />
        <Space h="lg" />
        <Center>
          <Pagination
            page={currentPage}
            onChange={setCurrentPage}
            total={totalPage}
          />
        </Center>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const wines = await getWines({})
  const filters = await getWineFilters()

  return {
    props: { wines, filters },
  }
}
