const optionsSQLite = {
  client: "sqlite3",
  connection: {
    filename: "./db/messages.sqlite",
  },
  useNullAsDefault: true
};

module.exports = {
  optionsSQLite,
};
