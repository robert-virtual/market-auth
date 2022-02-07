const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  const users = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ users });
});

module.exports = router;
