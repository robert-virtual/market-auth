const router = require("express").Router();
const { verify } = require("argon2");
const { PrismaClient } = require("@prisma/client");
const { genAccessToken, genRefreshToken } = require("../helpers/tokens");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

// logout
router.delete("/logout", auth, async (req, res) => {
  const { userId } = req;
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
    res.status(204).json({ msg: "session cerrada conexito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// refresh token
router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    let { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(403).json({ error: "Token invalido" });
    }
    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Token invalido" });
    }

    res.json({ token: genAccessToken(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login
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
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res.json({ token, refreshToken });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
