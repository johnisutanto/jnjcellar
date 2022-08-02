import { getBottleCounts } from "../../utils/connectDb"
import { AuthenticatedTemplate } from "@azure/msal-react"
import {
  Box,
  Text,
  Heading,
  Paragraph,
} from "grommet"
import styled from "styled-components"
import { Center } from "@mantine/core"

const MarginText = styled.div`
  margin-left: 20px;
`
const AboutUs = ({ bottleCounts }) => {
  return (
    <>
      <MarginText>
        <Heading level={2} size="medium">
          About Us
        </Heading>
      </MarginText>
      <Center>
      </Center>

      <Box pad="medium" fill>
        <Paragraph fill>
          What started with a trip to La Rioja has transformed into a family
          passion for discovering, collecting and enjoying wine with family and
          friends.
        </Paragraph>
        <Paragraph fill>
          This site serves as a live inventory of our collection shared with our
          closest friends. Each product is carefully selected, based on research
          and curiosity of region dominant grapes but also some special value to
          our family, some of them we love and some we hope we will.
        </Paragraph>
        <img
          src="https://wineimages.blob.core.windows.net/aboutus/JohniJuanBourbinSonoma.jpg"
          style={{ objectFit: "cover", width: "100%", height: "500px" }}
        />
      </Box>
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
