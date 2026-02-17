const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authcontroller");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/test", (req, res) => {
//     res.send("Auth route working");
// });

module.exports = router;
