import { useState } from "react"
import { getWineFilters } from "../../services/wine"
import { useForm } from "@mantine/form"
import { isEmpty } from "lodash"
import axios from "axios"
import { useRouter } from "next/router"
import WineForm from "components/WineForm"

export default function AddWine({ filters }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

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
      imageUrl: "",
      dateAcquired: new Date(),
      maturity: null,
    },
    validate: {
      varietal: (value) =>
        !isEmpty(value) ? null : "Select at least one varietal",
      color: (value) => (value >= 0 && value <= 2 ? null : "Select wine color"),
    },
  })
  const handleAddWine = async (newWine) => {
    axios
      .post("/api/addWine", {
        data: {
          ...newWine,
          varietal: form.values.varietal.join("|"),
        },
      })
      .then((res) => {
        console.log(`new wine is ${JSON.stringify(res)}`)
        setShowSuccessModal(true)
      })
  }
  return (
    <WineForm
      filters={filters}
      form={form}
      onSubmit={handleAddWine}
      onSuccess={() => router.push("/cellars")}
      showSuccessModal={showSuccessModal}
      mode="add"
      title="Add a new wine"
    />
  )
}

export async function getServerSideProps(context) {
  const filters = await getWineFilters()

  return {
    props: { filters },
  }
}
