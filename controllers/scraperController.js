const { GetJuniorJobs } = require("../scraper/scraper");
let { getJobsList, config } = require("indeed-job-scraper");

config["max-pages"] = 1; //the maximum number of visited pages
config["base-URL"] = "https://uk.indeed.com/"; //only include uk results

const ScrapeLinkedinJobs = async (req, res) => {
  let pageNum = req.query.pageNum || 0;
  const jobs = await GetJuniorJobs(pageNum);

  res.send(jobs);
};

const ScrapeIndeedJobs = async (req, res) => {
  let pageNum = req.query.pageNum || 1;
  config["max-pages"] = pageNum;
  const jobsData = await getJobsList({
    query: "developer",
    fromdays: 1,
    sitetype: "employer",
    sort: "date",
    maxperpage: 20,
  });
  res.send(jobsData);
};

module.exports = {
  ScrapeLinkedinJobs,
  ScrapeIndeedJobs,
};
