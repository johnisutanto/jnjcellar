// MyComponent.tsx
import {
  DefaultProps,
  Selectors,
  MantineNumberSize,
  Box,
  Center,
} from "@mantine/core"
import useStyles, { CellarSpaceParams } from "./index.styles"
import { Glass } from "tabler-icons-react"
import { noop } from "lodash"

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type CellarSpaceStylesNames = Selectors<typeof useStyles>

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface CellarSpaceProps
  extends DefaultProps<CellarSpaceStylesNames, CellarSpaceParams> {
  radius?: MantineNumberSize
  content: string
  isMobile: boolean
  isAvailable: boolean
  isSelected: boolean
  onSelect: () => void
}

export default function CellarSpace({
  content,
  classNames,
  styles,
  unstyled,
  radius,
  isMobile,
  isAvailable,
  isSelected,
  onSelect,
  className,
  ...others
}: CellarSpaceProps) {
  const { classes, cx } = useStyles(
    // First argument of useStyles is styles params
    { radius, isMobile, isAvailable },
    // Second argument is responsible for styles api integration
    { name: "CellarSpace", classNames, styles, unstyled }
  )

  // Use Box component as a base and spread ...others prop.
  // By doing so, you will add sx, padding (pt, pb, px, etc.) and margin (my, m, mt, etc.) props support
  return (
    <Box
      className={cx(
        classes.root,
        { [classes.available]: isAvailable, [classes.selected]: isSelected },
        className
      )}
      onClick={isAvailable ? onSelect : noop}
      {...others}
    >
      <div className={classes.title}>
        {isAvailable ? (
          content
        ) : (
          <Center>
            <Glass size={30} color={"#D3D3D3"} />
          </Center>
        )}
      </div>
    </Box>
  )
}
