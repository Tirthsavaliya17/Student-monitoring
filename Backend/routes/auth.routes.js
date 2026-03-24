const express = require("express");
const router = express.Router();
const {login , getCurrentUser} = require('../controllers/auth.controller');
const verifyToken = require("../middleware/auth.middleware");

router.post('/login',login);
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;