const express = require("express");
const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);

//router
const scraperRouter = require("./routes/scraperRoutes");

//route initialization
app.use("/api/v1/scraper", scraperRouter);

app.get("/", (request, response) => {
  response.send("Hi there");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listen on the port ${PORT}`);
});
