const axios = require("axios");
const cheerio = require("cheerio");

//Function to retrieve and parse job listings from linkedin for search Junior Developers in London
const getData = async (pageNum) => {
  // When page page is reached variable is set to false ;

  if (pageNum === 1) {
    pageNum = 0;
  } else {
    pageNum = pageNum * 25;
  }

  let linkedinJobs = [];
  try {
    const result = await axios.get(
      ` https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Developer&location=London&geoId=&trk=public_jobs_jobs-search-bar_search-submit&start=${pageNum}`
    );
    const html = result.data;

    // Code for parsing data with cheerio
    const $ = cheerio.load(html);
    //const jobs = $("li");

    // Extracts data for each job found
    $(".job-search-card").each(async (i, el) => {
      linkedinJobs.push({
        title: $(el).find(".base-search-card__title").text()?.trim(),
        company: $(el).find("h4.base-search-card__subtitle").text()?.trim(),
        link: $(el).find("a.base-card__full-link").attr("href")?.trim(),
        id: $(el).attr("data-entity-urn")?.split("urn:li:jobPosting:")[1],
        location: $(el).find(".job-search-card__location").text()?.trim(),
        date: $(el).find(".job-search-card__listdate").text()?.trim(),
      });
    });
  } catch (error) {
    console.log(error);
  }

  // Scrapes job description for each job in list

  for (let j = 0; j < linkedinJobs.length; j++) {
    let url2 = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${linkedinJobs[j].id}`;
    try {
      let response2 = await axios.get(url2);
      const html2 = response2.data;

      const $2 = cheerio.load(html2);

      let level = $2("li.description__job-criteria-item:nth-child(1) span")
        .text()
        .trim();

      let type = $2("li.description__job-criteria-item:nth-child(2) span")
        .text()
        .trim();

      let description = $2("div.description__text > section > div")
        .text()
        .trim();

      linkedinJobs[j].level = level;
      linkedinJobs[j].type = type;
      linkedinJobs[j].description = description;
    } catch (error) {
      console.log(error);
    }
  }
  //console.log("linkedindata ", linkedinJobs);

  return linkedinJobs;
};

const GetJuniorJobs = async (pageNum) => {
  let unfilteredJobs = await getData(pageNum);
  // Filter out any non junior roles
  return unfilteredJobs;
};

GetJuniorJobs();

module.exports = {
  GetJuniorJobs,
};
