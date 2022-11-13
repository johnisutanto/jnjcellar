import { AppProps } from "next/app"
import Head from "next/head"
import { MantineProvider, Global } from "@mantine/core"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "../services/msal"
import AppWrapper from "./AppWrapper"
import { NotificationsProvider } from "@mantine/notifications"

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  const CustomGlobal = () => (
    <Global
      styles={(theme) => ({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
      })}
    />
  )
  return (
    <MsalProvider instance={msalInstance}>
      <Head>
        <title>J & J Cellars</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          primaryColor: "pink",
        }}
      >
        <NotificationsProvider position="bottom-center">
          <CustomGlobal />
          <AppWrapper AppBody={() => <Component {...pageProps} />} />
        </NotificationsProvider>
      </MantineProvider>
    </MsalProvider>
  )
}
