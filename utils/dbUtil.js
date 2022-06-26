export const getDbConfig = () => ({
  authentication: {
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    type: "default",
  },
  server: process.env.DB_SERVER_URL,
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
  },
})
