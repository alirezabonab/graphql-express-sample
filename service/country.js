const rp = require("request-promise");
const { pick, pipe, head, lens, prop, assoc } = require("ramda");
const { getExchangeRate } = require("./currencyRate");

const buildCountryURL = countryName =>
  `https://restcountries.eu/rest/v2/name/${countryName}`;

const pickData = pipe(
  head,
  pick(["name", "population", "currencies"])
);

exports.getCountryByName = async countryName =>
  rp(buildCountryURL(countryName))
    .then(JSON.parse)
    .then(pickData)
    .then();
