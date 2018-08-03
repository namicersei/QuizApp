module.exports = {
  development: {
    secret: "secretkey",
    database: "mongodb://localhost:27017/quiz",
    siteUrl: "http://localhost:3000",
    email: {
      from: "s26c.sayan@gmail.com",
      host: "smtp-pulse.com",
      port: 465,
      auth: {
        user: "s26c.sayan@gmail.com",
        pass: "topsecret"
      }
    }
  },
  production: {
    secret: "secretkey",
    database: "mongodb://localhost:27017/quiz",
    siteUrl: "http://localhost:3000",
    email: {
      from: "s26c.sayan@gmail.com",
      host: "smtp-pulse.com",
      port: 465,
      auth: {
        user: "s26c.sayan@gmail.com",
        pass: "topsecret"
      }
    }
  }
}
