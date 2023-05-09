import React, { Fragment, useEffect, useState } from "react"
import { WINE_COLUMNS } from "../../model/wine"
import axios from "axios"
import { AuthenticatedTemplate } from "@azure/msal-react"
import { useRouter } from "next/router"
import {
  ActionIcon,
  Container,
  Flex,
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
import { IconArrowLeft, IconPlus, IconCheck, IconHome2, IconBuilding, IconPencil, IconStar } from "@tabler/icons-react"
import { isEmpty } from "lodash"
import CellarContainer from "../../components/Cellar/CellarContainer"
import { CELLARS } from "../../components/Cellar/index"
import { useMediaQuery } from "@mantine/hooks"
import useSWR from "swr"
import { showNotification } from "@mantine/notifications"
import Link from "next/link"

const WINE_COLUMNS_GROUPING = [
  [{ id: "Producer" }],
  [{ id: "Country" }, { id: "Region" }, { id: "Appellation" }],
  [{ id: "Vintage" }, { id: "DrinkDate", title: "Drink Date" }, { id: "Maturity" }],
  [{ id: "Color" }, { id: "AlcoholPct", title: "Alcohol %" }, { id: "Rating" }, { id: "Price", isPrivate: true }],
  [{ id: "Varietal" }],
  [{ id: "Location", isPrivate: true }],
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
  const [selectedLocations, setSelectedLocations] = useState({ STAIRCASE: [], STORAGE: [] })
  const [selectedCellar, setSelectedCellar] = useState("STAIRCASE")
  const handleSelectLocation = (cellar) => (location) => {
    const locations = selectedLocations[cellar]
    if (locations.includes(location)) {
      const selectedIndex = locations.indexOf(location)
      setSelectedLocations({
        ...selectedLocations,
        [cellar]: [
          ...locations.slice(0, selectedIndex),
          ...locations.slice(selectedIndex + 1),
        ]
      })
    } else {
      setSelectedLocations({
        ...selectedLocations,
        [cellar]: [...locations, location]
      })
    }
  }
  const [emptyShelves, setEmptyShelves] = useState({ STAIRCASE: [], STORAGE: [] })
  const isMobile = useMediaQuery("(max-width: 600px)")
  const onOpen = (loc, cellar) => () => {
    setSelectedLocation(loc)
    setSelectedCellar(cellar)
    setOpenRemovalDialog(true)
  }

  const handleRemoveWine = async () => {
    axios
      .post("/api/removeWineFromCellar", {
        id: wine.Id,
        location: selectedLocation,
        cellarId: selectedCellar,
      })
      .then((res) => {
        setCurrentWine(res.data)
        setOpenRemovalDialog(false)
        setSelectedLocation(null)
        showNotification({
          title: 'Wine bottle is removed successfully',
          message: 'Enjoy the wine. Cheers!!!',
          icon: <IconCheck />,
          color: "green",
        })
      })
  }
  const handleAddWineToCellar = (cellarId) => async () => {
    const res = await axios
      .post("/api/addWineToCellar", {
        id: wine.Id,
        locations: selectedLocations[cellarId],
        cellarId,
      })
    setCurrentWine(res.data)
    setOpenCellarDialog(false)
    setSelectedLocations({ STAIRCASE: [], STORAGE: [] })
    showNotification({
      title: 'Wine bottles added successfully',
      message: 'Come back soon to enjoy those bottles',
      icon: <IconCheck />,
      color: "green",
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
            <IconHome2 size={30} color={"#E64980"} />
            {(value || {})
              ?.STAIRCASE
              ?.map((val) => (
                <Button
                  variant="outline"
                  key={`location-${val}`}
                  onClick={onOpen(val, "STAIRCASE")}
                >
                  {val}
                </Button>
              ))}
            <Button
              variant="outline"
              leftIcon={<IconPlus size={16} />}
              onClick={() => {
                getEmptyShelves()
                setOpenCellarDialog(true)
                setSelectedCellar("STAIRCASE")
              }}
            >
              Add
            </Button>
          </Group>
          <Space h="md" />
          <Group>
            <IconBuilding size={30} color={"#E64980"} />
            {(value || {})
              ?.STORAGE
              ?.map((val) => (
                <Button
                  variant="outline"
                  key={`location-${val}`}
                  onClick={onOpen(val, "STORAGE")}
                >
                  {val}
                </Button>
              ))}
            <Button
              variant="outline"
              leftIcon={<IconPlus size={16} />}
              onClick={() => {
                getEmptyShelves()
                setOpenCellarDialog(true)
                setSelectedCellar("STORAGE")
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
          cellarConfig={CELLARS[selectedCellar]}
          isMobile={isMobile}
          emptyShelves={emptyShelves[selectedCellar]}
          selectedLocations={selectedLocations[selectedCellar]}
          onSelectSpace={handleSelectLocation(selectedCellar)}
        />
        <Space h="xl" />
        <Group position="right">
          <Button onClick={handleAddWineToCellar(selectedCellar)}>Add</Button>
          <Button variant="outline" onClick={() => setOpenCellarDialog(false)}>
            Cancel
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
              leftIcon={<IconArrowLeft size={32} />}
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
            <Flex gap="xs" justify="flex-start" align="center">
              <Title order={1}>{currentWine.Name}</Title>
              <AuthenticatedTemplate>
                <Space w="xs" />
                <ActionIcon variant="subtle" component={Link} href={`/wine/${id}/edit`}><IconPencil size="2rem" /></ActionIcon>
              </AuthenticatedTemplate>
            </Flex>
            <Space h="xl" />
            <Space h="md" />
            {WINE_COLUMNS_GROUPING.map((group) => (
              <Fragment key={`${group.join("#")}`}>
                <Group spacing="xl" grow>
                  {group.map((field) => {
                    const column = WINE_COLUMNS.find(
                      (col) => col.name === field.id
                    )
                    return field.isPrivate ? (
                      <AuthenticatedTemplate>
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
                      </AuthenticatedTemplate>
                      ) : (
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
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default Wine
