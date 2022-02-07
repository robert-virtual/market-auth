const { sign } = require("jsonwebtoken");

exports.genAccessToken = (user) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

exports.genRefreshToken = (user) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET);
};
