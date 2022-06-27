import "../styles.css"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "../services/msal"

export default function MyApp({ Component, pageProps }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} />
    </MsalProvider>
  )
}
