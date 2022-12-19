import { createStyles, MantineNumberSize } from "@mantine/core"

// Styles params are optional
export interface CellarContainerParams {
  radius: MantineNumberSize
  isMobile: boolean
  cellarConfig: number[]
}

let gridCss = {}
const createGridTemplateAreas = (cellarConfig: number[]) => {
  const grid = []
  const cellarWidth = Math.max(...cellarConfig)
  for (let i = 0; i < cellarConfig.length; i++) {
    const row = []
    for (let j = 0; j < cellarWidth; j++) {
      const gridName = `${String.fromCharCode(65 + j)}${cellarConfig.length - i}`
      row.push(
        j < cellarConfig[i]
          ? gridName
          : "."
      )
      if (j < cellarConfig[i]) {
        gridCss[gridName] = { gridArea: gridName }
      }
    }
    grid.push(`"${row.join(" ")}"`)
  }
  return grid.join("\n")
}

export default createStyles((theme, { radius, isMobile, cellarConfig }: CellarContainerParams) => ({
  // add all styles as usual
  root: {
    borderRadius: theme.fn.radius(radius),
    display: "grid",
    gridTemplateColumns: `repeat(${Math.max(...cellarConfig)}, 1fr)`,
    gridTemplateRows: "1fr",
    gridColumnGap: isMobile ? 0 : "8px",
    gridRowGap: "8px",
    maxWidth: 600,
    gridTemplateAreas: createGridTemplateAreas(cellarConfig),
  },
  ...gridCss,
  title: { fontSize: theme.fontSizes.sm },
  description: { fontSize: theme.fontSizes.xs },
}))
