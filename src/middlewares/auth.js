const { response, request } = require("express");
const { verify } = require("jsonwebtoken");

function auth(req = request, res = response, next) {
  let token = req.header("atk"); //atk = auth token

  console.log(token);
  if (!token) {
    return res.status(403).json({ error: "acceso denegado" });
  }
  try {
    let payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("payload: ", payload.userId);
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = auth;
