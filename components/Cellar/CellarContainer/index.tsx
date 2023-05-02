// MyComponent.tsx
import { DefaultProps, Selectors, MantineNumberSize, Box } from "@mantine/core"
import useStyles, { CellarContainerParams } from "./index.styles"
import CellarSpace from "../CellarSpace"

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type CellarSpaceStylesNames = Selectors<typeof useStyles>

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface CellarSpaceProps
  extends DefaultProps<CellarSpaceStylesNames, CellarContainerParams> {
  radius?: MantineNumberSize
  content: string
  cellarConfig: number[]
  isMobile: boolean
  emptyShelves: string[]
  onSelectSpace: (space: string) => void
  selectedLocations: string[]
}

export default function CellarContainer({
  classNames,
  styles,
  unstyled,
  radius,
  cellarConfig,
  isMobile,
  onSelectSpace,
  emptyShelves,
  selectedLocations,
  className,
  ...others
}: CellarSpaceProps) {
  const { classes, cx } = useStyles(
    // First argument of useStyles is styles params
    { radius, isMobile, cellarConfig },
    // Second argument is responsible for styles api integration
    { name: "CellarContainer", classNames, styles, unstyled }
  )

  const handleSelectSpace = (location) => () => {
    onSelectSpace(location)
  }

  // Use Box component as a base and spread ...others prop.
  // By doing so, you will add sx, padding (pt, pb, px, etc.) and margin (my, m, mt, etc.) props support
  return (
    <Box className={cx(classes.root, className)} {...others}>
      {cellarConfig.map((row, index) =>
        [...Array(row).keys()].map((col) => {
          const gridArea = `${String.fromCharCode(65 + col)}${
            cellarConfig.length - index
          }`
          return (
            <CellarSpace
              key={`col-${index}-${col}`}
              content={gridArea}
              className={classes[gridArea]}
              isMobile={isMobile}
              isAvailable={emptyShelves?.includes(gridArea)}
              isSelected={selectedLocations.includes(gridArea)}
              onSelect={handleSelectSpace(gridArea)}
            />
          )
        })
      )}
    </Box>
  )
}
