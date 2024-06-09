const serialize = (data) => {
  const { password, ...rest } = data;
  return rest;
};

module.exports = {
  serialize,
};
