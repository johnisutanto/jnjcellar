import React, { useState, useEffect } from "react"
import Link from "next/link"
import useQueryState, { toCleanQueryString } from "../../utils/useQueryState"
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
  LoadingOverlay,
} from "@mantine/core"
import { AuthenticatedTemplate } from "@azure/msal-react"
import useSWR from "swr"
import { compact } from "lodash"

const DEFAULT_FILTERS = {
  country: null,
  color: null,
  region: null,
  varietal: null,
  maturity: null,
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

const fetcher = (...args) => fetch(...args).then((res) => res.json())
const wineColorOptions = ["Red", "White", "Rose"]
export default function Home() {
  const { data: filters, filtersError } = useSWR("/api/getWineFilters", fetcher)
  const [currentWines, setCurrentWines] = useState([])
  const [wineFilters, setWineFilters] = useQueryState(DEFAULT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [queryString, setQueryString] = useState("")
  const { data: wines, error } = useSWR(
    `/api/search?page=${currentPage - 1}&${queryString}`,
    fetcher
  )
  useEffect(() => {
    if (!wines) return
    setCurrentWines(wines.results)
    setTotalPage(Math.ceil(wines.totalCount / 15))
  }, [wines])

  useEffect(() => {
    const params = {}
    const colorIndex = wineColorOptions.findIndex(
      (color) => color === wineFilters.color
    )
    if (colorIndex !== -1) {
      params.Color = colorIndex
    }
    if (wineFilters.country) {
      params.Country = wineFilters.country
    }
    if (wineFilters.region) {
      params.Region = wineFilters.region
    }
    if (wineFilters.varietal) {
      params.Varietal = wineFilters.varietal
    }
    if (wineFilters.maturity) {
      params.Maturity = wineFilters.maturity
    }
    setQueryString(toCleanQueryString(params))
  }, [wineFilters])

  const handleWineFilter = (filterName) => (option) => {
    setWineFilters({
      ...wineFilters,
      [filterName]: option,
    })
  }

  const { classes } = useStyles()

  if (!wines || !filters) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }
  return (
    <>
      <Container fluid>
        <Space h="lg" />
        <Center>
          {filters && (
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
              <Select
                clearable
                id="select-maturity"
                name="select-maturity"
                placeholder="Maturity"
                value={wineFilters.maturity}
                data={compact(filters.maturity)}
                onChange={handleWineFilter("maturity")}
              />
            </Group>
          )}
        </Center>
      </Container>
      <Space h="xl" />
      <Space h="xl" />
      <Container fluid px="xl">
        <Grid>
          {(currentWines || []).map((wine, index) => (
            <Grid.Col sm={6} md={4} xl={2} lg={3} key={`card-wine-${wine.Id}`}>
              <Card
                p="lg"
                component={Link}
                radius="md"
                withBorder
                href={`/wine/${wine.Id}`}
              >
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
