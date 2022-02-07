const router = require("express").Router();
const { verify } = require("argon2");
const { PrismaClient } = require("@prisma/client");
const { genAccessToken, genRefreshToken } = require("../helpers/tokens");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    res.json({ token: genAccessToken() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(403).json({ error: "Credenciales incorrectas" });
    }
    let valid = await verify(user.password, password);
    if (!valid) {
      return res.status(403).json({ error: "Credenciales incorrectas" });
    }
    const token = genAccessToken(user);
    const refreshToken = genRefreshToken(user);

    res.json({ token, refreshToken });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
