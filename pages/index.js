import Head from "next/head"
import { executeSql } from "../utils/connectDb"
import {
  Grommet,
  Box,
  Card,
  Grid,
  Text,
  CardHeader,
  Header,
  Nav,
  Anchor,
  Select,
} from "grommet"
import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';

import { deepFreeze } from "grommet/utils"

export const customTheme = deepFreeze({
  global: {
    colors: {
      brand: "#58181F",
      focus: "#F4C4BB",
      "accent-1": "#F4C4BB",
    },
  },
})

const HoverableCard = styled(Card)`
  &:hover {
    background-color: #dcdcdc;
    cursor: pointer;
  }
`

const StyledHeader = styled(Header)`
  background: url("https://wineimages.blob.core.windows.net/images/Cellar.png");
  opacity: 0.75;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 200px;
`
const Title = styled.span`
  font-family: monospace;
`
export default function Home({ wines }) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentWines, setCurrentWines] = useState(wines)
  const { instance } = useMsal();

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }
  const wineColorOptions = ["Red", "White", "Rose"]
  const [selectedColor, setSelectedColor] = useState(null)
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })
  const handleSearch = async () => {
    axios.post("/api/search", {
      Color: wineColorOptions.findIndex(color => color === selectedColor)
    }).then(res => {
      // console.log(`new wine is ${JSON.stringify(res)}`)
      setCurrentWines(res.data)
    })

  }
  useEffect(() => {
    if (!selectedColor) return;
    handleSearch()
  }, [selectedColor])
  const handleColorChange = ({ option }) => {
    setSelectedColor(option)
  }
  return (
    <Grommet full theme={customTheme}>
      <Header background="light-4" pad="small">
        {/* <Avatar src={gravatarLink} /> */}
        <Nav direction="row">
          <Anchor label="Home" href="#" />
          <UnauthenticatedTemplate>
            <Anchor label="Login" href="#" onClick={() => instance.loginRedirect()} />
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <Anchor label="Logout" href="#" onClick={() => instance.logoutRedirect()} />
          </AuthenticatedTemplate>
          <Anchor label="About Us" href="#" />
        </Nav>
      </Header>
      <Header
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
      </Header>

      <main>
        <Box direction="row" pad="large">
          <Select
            id="select"
            name="select"
            placeholder="Wine Color"
            value={selectedColor}
            options={wineColorOptions}
            onChange={handleColorChange}
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
      </main>

      <footer>Juansi is whining</footer>
    </Grommet>
  )
}

export async function getServerSideProps(context) {
  const wines = await executeSql()

  // const isConnected = await client.isConnected() // Returns true or false

  return {
    props: { wines },
  }
}
