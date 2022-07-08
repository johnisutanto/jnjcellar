import JnjHeader from "./header"
import JnjFooter from "./footer"
import { Grommet } from "grommet"
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

export default function Layout({ children }) {
  return (
    <Grommet full theme={customTheme}>
      <JnjHeader />
      <main>{children}</main>
      <JnjFooter />
    </Grommet>
  )
}
