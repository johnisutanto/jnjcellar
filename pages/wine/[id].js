import React, { Fragment, useEffect, useState } from "react"
import { WINE_COLUMNS } from "../../model/wine"
import axios from "axios"
import { AuthenticatedTemplate } from "@azure/msal-react"
import { useRouter } from "next/router"
import {
  Container,
  Grid,
  Title,
  Image,
  useMantineTheme,
  Group,
  Space,
  Text,
  Badge,
  Button,
  Modal,
  Stack,
  LoadingOverlay,
} from "@mantine/core"
import { ArrowLeft, Plus } from "tabler-icons-react"
import { isEmpty } from "lodash"
import CellarContainer from "../../components/Cellar/CellarContainer"
import { useMediaQuery } from "@mantine/hooks"
import useSWR from "swr"

const WINE_COLUMNS_GROUPING = [
  ["Producer"],
  ["Country", "Region", "Appellation"],
  ["Vintage", "DrinkDate"],
  ["Color", "AlcoholPct", "Rating"],
  ["Varietal"],
]
const RESTRICTED_WINE_COLUMNS_GROUPING = [["Location", "Price"]]
const EXCLUDED_COLUMNS = ["Id", "ImageUrl", "Location", "Price"]
const fetcher = (...args) => fetch(...args).then((res) => res.json())
const Wine = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: wine, error } = useSWR(id ? `/api/wine/${id}` : null, fetcher)
  const [currentWine, setCurrentWine] = useState(null)

  useEffect(() => {
    setCurrentWine(wine)
  }, [wine])

  const [openRemovalDialog, setOpenRemovalDialog] = useState(false)
  const [openCellarDialog, setOpenCellarDialog] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocations, setSelectedLocations] = useState([])
  const handleSelectLocation = (location) => {
    if (selectedLocations.includes(location)) {
      const selectedIndex = selectedLocations.indexOf(location)
      setSelectedLocations([
        ...selectedLocations.slice(0, selectedIndex),
        ...selectedLocations.slice(selectedIndex + 1),
      ])
    } else {
      setSelectedLocations([...selectedLocations, location])
    }
  }
  const [emptyShelves, setEmptyShelves] = useState([])
  const isMobile = useMediaQuery("(max-width: 600px)")
  const onOpen = (loc) => () => {
    setSelectedLocation(loc)
    setOpenRemovalDialog(true)
  }

  const handleRemoveWine = async () => {
    axios
      .post("/api/removeWineFromCellar", {
        id: wine.Id,
        location: selectedLocation,
      })
      .then((res) => {
        setCurrentWine(res.data)
        setOpenRemovalDialog(false)
        setSelectedLocation(null)
      })
  }
  const handleAddWineToCellar = async () => {
    axios
      .post("/api/addWineToCellar", {
        id: wine.Id,
        locations: selectedLocations,
      })
      .then((res) => {
        setCurrentWine(res.data)
        setOpenCellarDialog(false)
        setSelectedLocations([])
      })
  }
  const getEmptyShelves = async () => {
    axios.get("/api/getEmptyShelves").then((res) => {
      setEmptyShelves(res.data)
    })
  }
  const Property = ({ name, value }) => (
    <>
      <Text size="sm" color="dimmed">
        {name}
      </Text>
      {name === "Varietal" && (
        <>
          <Space h="sm" />
          <Group>
            {value.split("|").map((val) => (
              <Badge key={val} size="lg">
                {val}
              </Badge>
            ))}
          </Group>
        </>
      )}
      {name === "Location" && (
        <>
          <Space h="sm" />
          <Group>
            {(value || "")
              .split("|")
              .filter((val) => !isEmpty(val))
              .map((val) => (
                <Button
                  variant="outline"
                  key={`location-${val}`}
                  onClick={onOpen(val)}
                >
                  {val}
                </Button>
              ))}
            <Button
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                getEmptyShelves()
                setOpenCellarDialog(true)
              }}
            >
              Add
            </Button>
          </Group>
        </>
      )}
      {name !== "Varietal" && name !== "Location" && (
        <Text
          size="xl"
          sx={{ "&:empty:before": { content: `'empty'`, color: "white" } }}
        >
          {value}
        </Text>
      )}
    </>
  )

  const theme = useMantineTheme()
  if (!wine || !currentWine) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }

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
        opened={openRemovalDialog}
        onClose={() => setOpenRemovalDialog(false)}
        centered
        title={
          <Text size="md" color="pink" weight={700}>
            Confirm wine retrieval
          </Text>
        }
      >
        Removing wine from location {selectedLocation}?
        <Space h="xl" />
        <Group position="right">
          <Button onClick={handleRemoveWine}>Yes</Button>
          <Button variant="outline" onClick={() => setOpenRemovalDialog(false)}>
            No
          </Button>
        </Group>
      </Modal>
      <Modal
        size="lg"
        padding={isMobile ? "sm" : "xl"}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={openCellarDialog}
        onClose={() => setOpenCellarDialog(false)}
        centered
        title={
          <Text size="md" color="pink" weight={700}>
            Select the location to add this wine!
          </Text>
        }
      >
        <CellarContainer
          isMobile={isMobile}
          emptyShelves={emptyShelves}
          selectedLocations={selectedLocations}
          onSelectSpace={handleSelectLocation}
        />
        <Space h="xl" />
        <Group position="right">
          <Button onClick={handleAddWineToCellar}>Add</Button>
          <Button variant="outline" onClick={() => setOpenCellarDialog(false)}>
            No
          </Button>
        </Group>
      </Modal>
      <Container my="md">
        <Grid>
          <Grid.Col xs={4}>
            <Button
              color="pink"
              variant="subtle"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft size={32} />}
            >
              Back
            </Button>
            <Space h="xl" />
            <Image
              src={wine.ImageUrl}
              alt={wine.Name}
              height={500}
              fit="contain"
              withPlaceholder
            />
          </Grid.Col>
          <Grid.Col xs={8}>
            <Title order={1}>{currentWine.Name}</Title>
            <Space h="xl" />
            <Space h="md" />
            {WINE_COLUMNS_GROUPING.map((group) => (
              <Fragment key={`${group.join("#")}`}>
                <Group spacing="xl" grow>
                  {group.map((field) => {
                    const column = WINE_COLUMNS.find(
                      (col) => col.name === field
                    )
                    return (
                      <Fragment key={`column-${field}`}>
                        <Stack spacing={0}>
                          <Property
                            name={column.name}
                            value={
                              column.transform
                                ? column.transform(currentWine[column.name])
                                : currentWine[column.name]
                            }
                          />
                        </Stack>
                        <Space w="xl" />
                      </Fragment>
                    )
                  })}
                </Group>
                <Space h="xl" />
              </Fragment>
            ))}
            <AuthenticatedTemplate>
              {RESTRICTED_WINE_COLUMNS_GROUPING.map((group) => (
                <Fragment key={`${group.join("#")}`}>
                  <Group spacing="xl" grow align="flex-start">
                    {group.map((field) => {
                      const column = WINE_COLUMNS.find(
                        (col) => col.name === field
                      )
                      return (
                        <Fragment key={`column-${field}`}>
                          <Stack spacing={0} justify="flex-start">
                            <Property
                              name={column.name}
                              value={
                                column.transform
                                  ? column.transform(currentWine[column.name])
                                  : currentWine[column.name]
                              }
                            />
                          </Stack>
                          <Space w="xl" />
                        </Fragment>
                      )
                    })}
                  </Group>
                  <Space h="xl" />
                </Fragment>
              ))}
            </AuthenticatedTemplate>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default Wine
