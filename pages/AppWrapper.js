import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react"
import {
  createStyles,
  AppShell,
  Header,
  Navbar,
  Burger,
  MediaQuery,
  Anchor,
  Space,
  Footer,
  Center,
} from "@mantine/core"
import { useState } from "react"
import Link from "next/link"
import JnjLogo from "../shared/JnjLogo"

const useStyles = createStyles((theme) => ({
  navbar: {
    [theme.fn.smallerThan("sm")]: {
      backgroundColor: "#58181F",
    },
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  links: {
    
    fontWeight: 600,
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
    [theme.fn.largerThan("sm")]: {
      display: "flex",
    },
  },

  navbarLinks: {
    [theme.fn.smallerThan("sm")]: {
      color: "white",
      display: "flex",
      alignSelf: "center",
      fontSize: 20,
      "&:hover": {
        color: theme.colors.gray[1],
      },
      "&:first-of-type": {
        marginTop: 30,
      }
    },
    [theme.fn.largerThan("sm")]: {
      color: theme.colors.gray[0],
      "&:hover": {
        color: theme.colors.gray[1],
      },
    },
  },
}))

export default function AppWrapper(props) {
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)
  const { instance } = useMsal()
  const AppBody = props.AppBody
  const createLink = (label) => (
    <Anchor className={classes.navbarLinks} onClick={() => setOpened(false)}>{label}</Anchor>
  )
  const renderHeaderLinks = () => (
    <>
      <JnjLogo height={30} color="white" />
      <Space w="lg" />
      <Link href="/" passHref>
        {createLink("Home")}
      </Link>
      <Space w="md" />
      <Link href="/cellars" passHref>
        {createLink("Our Wines")}
      </Link>
      <Space w="md" />
      <Link href="/aboutus" passHref>
        {createLink("About Us")}
      </Link>
      <Space w="md" />
      <UnauthenticatedTemplate>
        <Anchor
          className={classes.navbarLinks}
          onClick={() => instance.loginRedirect()}
        >
          Login
        </Anchor>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Link href="/add" passHref>
          <Anchor className={classes.navbarLinks}>Add Wine</Anchor>
        </Link>
        <Space w="md" />
        <Anchor
          className={classes.navbarLinks}
          onClick={() => instance.logoutRedirect()}
        >
          Logout
        </Anchor>
      </AuthenticatedTemplate>
    </>
  )
  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      header={
        <Header
          height={60}
          sx={{ padding: "16px", backgroundColor: "#58181F", border: "none" }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              mr="xl"
              color="white"
            />
          </MediaQuery>
          <div className={classes.links}>{renderHeaderLinks()}</div>
        </Header>
      }
      navbar={
        <Navbar
          className={classes.navbar}
          width={{ base: "100%", sm: 0 }}
          hidden={!opened}
        >
          {renderHeaderLinks()}
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <Center>🍷 Juansi is whining 🥂 Johni is wining 🍷</Center>
        </Footer>
      }
      padding={0}
    >
      {AppBody && <AppBody />}
    </AppShell>
  )
}
