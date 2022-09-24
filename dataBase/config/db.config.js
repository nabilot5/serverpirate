module.exports = {
    // HOST: "localhost",
    // USER: "root",
    // PASSWORD: "",
    // DB: "piratedice",
    HOST: "us-cdbr-east-06.cleardb.net",
    USER: "b9f8a9298dc7a1",
    PASSWORD: "e9ba5cba",
    DB: "heroku_e1031f8a94127e3",
    // HOST: "eu-cdbr-west-03.cleardb.net",
    // USER: "b7d1ad1be05978",
    // PASSWORD: "0da8f7ef",
    // DB: "heroku_919cda0b0abc485",
    // HOST: "localhost",
    // USER: "root",
    // PASSWORD: "1234",
    // DB: "piratedice",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};