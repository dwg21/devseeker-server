let { getJobsList, config } = require("indeed-job-scraper");

config["max-pages"] = 7; //the maximum number of visited pages
config["base-URL"] = "https://uk.indeed.com/"; //change the locality domain to restrict the search results to your country

//get job list data
let data;
let test = async () => {
  data = await getJobsList({
    query: "developer",
    fromdays: 1,
    sitetype: "employer",
    sort: "date",
    maxperpage: 20,
  });
  console.log(data);
};

test();

//console.log(data.length);
