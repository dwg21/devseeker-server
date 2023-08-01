const { GetJuniorJobs } = require("../scraper/scraper");

const ScrapeLinkedinJobs = async (req, res) => {
  let pageNum = req.query.pageNum || 0;
  const jobs = await GetJuniorJobs(pageNum);

  res.send(jobs);
};

module.exports = {
  ScrapeLinkedinJobs,
};
