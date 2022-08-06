import { getBottleCounts } from "../../utils/connectDb"
import { AuthenticatedTemplate } from "@azure/msal-react"
import styled from "styled-components"
import { Center, Container, Title, Space, Text } from "@mantine/core"

const MarginText = styled.div`
  margin-left: 20px;
`
const AboutUs = ({ bottleCounts }) => {
  return (
    <>
      <Space h="xl" />
      <Space h="xl" />
      <MarginText>
        <Title order={1} size="medium">
          About Us
        </Title>
      </MarginText>
      <Center></Center>
      <Space h="xl" />
      <Space h="xl" />
      <Container fluid px="xl">
        <Text>
          What started with a trip to La Rioja has transformed into a family
          passion for discovering, collecting and enjoying wine with family and
          friends.
        </Text>
        <Text>
          This site serves as a live inventory of our collection shared with our
          closest friends. Each product is carefully selected, based on research
          and curiosity of region dominant grapes but also some special value to
          our family, some of them we love and some we hope we will.
        </Text>
        <Space h="xl" />
        <Space h="xl" />
        <img
          src="https://wineimages.blob.core.windows.net/aboutus/JohniJuanBourbinSonoma.jpg"
          style={{ objectFit: "cover", width: "100%", height: "500px" }}
        />
      </Container>
      <AuthenticatedTemplate>
        <MarginText>
          <Text size="small">Bottle Count: {bottleCounts}</Text>
        </MarginText>
      </AuthenticatedTemplate>
    </>
  )
}

export async function getServerSideProps(context) {
  const bottleCounts = await getBottleCounts()

  return {
    props: { bottleCounts },
  }
}

export default AboutUs
