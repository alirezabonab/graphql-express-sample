const rp = require("request-promise");
const config = require("../config");
const { path, pipe, filter, map, toPairs, fromPairs } = require("ramda");

const getSEKrate = data => {
  const sekRateToEUR = pipe(path(["rates", "SEK"]))(data);
  const convertToSEKRate = ([cur, rate]) => [cur, sekRateToEUR / rate];

  return pipe(
    path(["rates"]),
    toPairs,
    filter(item => item[0] != "SEK"),
    map(convertToSEKRate),
    fromPairs
  )(data);
};

const buildExchangeRateURL = symbols =>
  `http://data.fixer.io/api/latest?access_key=${
    config.FIXER_API_KEY
  }&symbols=${symbols.join(",")}&format=1`;

exports.getExchangeRate = async symbols =>
  rp(buildExchangeRateURL(symbols))
    .then(JSON.parse)
    .then(getSEKrate);
