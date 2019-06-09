const defaultValues = {
  FIXER_API_KEY: "1a6d05201fc7e0e4f9a2324566ddfa3a",
  PRIVATE_KEY: "f4820501949248e5be28145c26b6c09a"
};

module.exports = Object.entries(defaultValues).reduce(
  (config, [key, value]) => {
    config[key] = process.env[key] || value;
    return config;
  },
  {}
);
