import { createStyles, MantineNumberSize } from "@mantine/core"

// Styles params are optional
export interface CellarContainerParams {
  radius: MantineNumberSize
  isMobile: boolean
}

const CELLAR = [1, 2, 4, 5, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
let gridCss = {}
const createGridTemplateAreas = () => {
  const grid = []
  for (let i = 0; i < CELLAR.length; i++) {
    const row = []
    for (let j = 0; j < 8; j++) {
      const gridName = `${String.fromCharCode(65 + j)}${CELLAR.length - i}`
      row.push(
        j < CELLAR[i]
          ? gridName
          : "."
      )
      if (j < CELLAR[i]) {
        gridCss[gridName] = { gridArea: gridName }
      }
    }
    grid.push(`"${row.join(" ")}"`)
  }
  return grid.join("\n")
}

export default createStyles((theme, { radius, isMobile }: CellarContainerParams) => ({
  // add all styles as usual
  root: {
    borderRadius: theme.fn.radius(radius),
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gridTemplateRows: "1fr",
    gridColumnGap: isMobile ? 0 : "8px",
    gridRowGap: "8px",
    maxWidth: 600,
    gridTemplateAreas: createGridTemplateAreas(),
  },
  ...gridCss,
  title: { fontSize: theme.fontSizes.sm },
  description: { fontSize: theme.fontSizes.xs },
}))
