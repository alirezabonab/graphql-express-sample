const express = require("express");
const router = express.Router();
const { assoc } = require("ramda");
const { CountryService, CurrencyRateService } = require("../service");

var expressGraphql = require("express-graphql");
var { buildSchema } = require("graphql");

// craeting our Graphql schema
var schema = buildSchema(`
  type Query {
    country(name : String): Country
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
  country: async ({ name }) => {
    const countryInfo = await CountryService.getCountryByName(name);
    const currencieCodes = countryInfo.currencies.map(c => c.code);
    currencieCodes.push("SEK");
    const currencyInfo = await CurrencyRateService.getExchangeRate(
      currencieCodes
    );

    countryInfo.currencies = countryInfo.currencies.map(item =>
      assoc(
        `sekRate`,
        countryInfo.name.toLowerCase() === "sweden"
          ? 1
          : currencyInfo[item.code]
      )(item)
    );

    return countryInfo;
  }
};

// setting up router to use express-graphql
router.use(
  "/",
  expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

module.exports = router;
