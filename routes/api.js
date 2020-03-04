const express = require("express");

const router = express.Router();

const apiController = require("../controllers/api");

router.get("/ping", apiController.getPing);

router.get("/posts", apiController.getPosts);

module.exports = router;
