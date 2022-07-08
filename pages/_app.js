import "../styles.css"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "../services/msal"
import Layout from "./layout"

export default function MyApp({ Component, pageProps }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MsalProvider>
  )
}
