const express = require("express");
const router = express.Router();
const { assoc } = require("ramda");
const { getCountryByName } = require("../service/country");
const { getExchangeRate } = require("../service/currencyRate");

var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");

var schema = buildSchema(`
  type Query {
    country(name : String): Country,
    hello : String
  },
  type Country{
      name : String
      population : Int,
      currencies : [Currency]
  },
  type Currency{
      code : String
      name : String
      symbol : String
      sekRate : Float
  }
`);

var root = {
  hello: () => "HI How are you?",
  country: async ({ name }) => {
    const countryInfo = await getCountryByName(name);
    const currencies = countryInfo.currencies.map(c => c.code);
    currencies.push("SEK");
    const currencyInfo = await getExchangeRate(currencies);

    countryInfo.currencies = countryInfo.currencies.map(item =>
      assoc(`sekRate`, currencyInfo[item.code])(item)
    );

    return countryInfo;
  }
};

router.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

module.exports = router;
