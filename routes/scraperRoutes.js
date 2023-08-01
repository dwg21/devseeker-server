const express = require("express");
const router = express.Router();

const { ScrapeLinkedinJobs } = require("../controllers/scraperController");

router.route("/").get(ScrapeLinkedinJobs);

module.exports = router;
