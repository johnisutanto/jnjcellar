import { createStyles, MantineNumberSize } from "@mantine/core"

// Styles params are optional
export interface CellarSpaceParams {
  radius: MantineNumberSize
  isMobile: boolean
  isAvailable: boolean
}

export default createStyles(
  (theme, { radius, isAvailable }: CellarSpaceParams) => ({
    // add all styles as usual
    root: {
      borderRadius: theme.fn.radius(radius),
      border: "2px solid pink",
      borderColor: isAvailable ? "pink" : "#D3D3D3",
      textAlign: "center",
      color: "gray",
      flex: "0 0 100%",
      alignContent: "center",
      width: "100%",
    },
    available: {
      color: "#58181F",
      "&:hover": {
        backgroundColor: "#58181F",
        cursor: "pointer",
        color: "white",
      },
    },
    selected: {
      backgroundColor: "#58181F",
      color: "white",
      border: "2px solid #ab003f",
    },
    title: {
      fontSize: theme.fontSizes.sm,
      height: "100%",
      minHeight: 42,
      display: "inline-flex",
      alignItems: "center",
    },
    description: { fontSize: theme.fontSizes.xs },
  })
)
