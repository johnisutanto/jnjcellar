import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import { getWineFilters } from "../../../services/wine"
import { useForm } from "@mantine/form"
import { isEmpty } from "lodash"
import axios from "axios"
import WineForm from "components/WineForm"

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const EditWine = ({ filters }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: wine } = useSWR(id ? `/api/wine/${id}` : null, fetcher)
  const [_currentWine, setCurrentWine] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const form = useForm({
    initialValues: {
      name: "",
      country: "",
      region: "",
      producer: "",
      appellation: "",
      vintage: "",
      color: -1,
      location: "",
      price: "",
      imageUrl: "",
      alcoholPct: "",
      rating: "",
      varietal: [],
      drinkDate: "",
      dateAcquired: new Date(),
      maturity: null,
    },
    validate: {
      varietal: (value) =>
        !isEmpty(value) ? null : "Select at least one varietal",
      color: (value) => (value >= 0 && value <= 2 ? null : "Select wine color"),
    },
  })

  useEffect(() => {
    if (!wine) {
      return
    }
    setCurrentWine(wine)
    form.setValues({
      name: wine.Name,
      country: wine.Country,
      region: wine.Region,
      producer: wine.Producer,
      appellation: wine.Appellation,
      vintage: wine.Vintage,
      color: wine.Color,
      location: wine.Location,
      price: wine.Price,
      imageUrl: wine.ImageUrl,
      alcoholPct: wine.AlcoholPct,
      rating: wine.Rating,
      varietal: wine.Varietal.split("|"),
      drinkDate: wine.DrinkDate,
      dateAcquired: new Date(wine.DateAcquired),
      maturity: wine.Maturity,
    })
  }, [wine])

  const handleEditWine = async (newWine) => {
    axios
      .post("/api/editWine", {
        wine: {
          ...newWine,
          varietal: form.values.varietal.join("|"),
        },
        id,
      })
      .then((res) => {
        console.log(`new wine is ${JSON.stringify(res)}`)
        setShowSuccessModal(true)
      })
  }
  return wine ? (
    <WineForm
      filters={filters}
      form={form}
      onSubmit={handleEditWine}
      onSuccess={() => router.push(`/wine/${id}`)}
      showSuccessModal={showSuccessModal}
      mode="edit"
      title={`Edit: ${wine.Name}`}
    />
  ) : null
}

export async function getServerSideProps(_context) {
  const filters = await getWineFilters()

  return {
    props: { filters },
  }
}

export default EditWine
