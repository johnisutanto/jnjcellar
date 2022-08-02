import { createStyles, Container } from '@mantine/core';
const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    width: "100%",
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const JnjFooter = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.footer}>
    <Container className={classes.inner}>
      🍷 Juansi is whining 🥂 Johni is wining 🍷
    </Container>
    </div>
  )
}

export default JnjFooter
