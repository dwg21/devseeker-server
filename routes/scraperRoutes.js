const express = require("express");
const router = express.Router();

const {
  ScrapeLinkedinJobs,
  ScrapeIndeedJobs,
} = require("../controllers/scraperController");

router.route("/").get(ScrapeLinkedinJobs);
router.route("/indeed").get(ScrapeIndeedJobs);

module.exports = router;
