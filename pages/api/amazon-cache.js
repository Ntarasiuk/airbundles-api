// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const cheerio = require("cheerio");
const got = require("got");
const he = require("he");

export default async function handler(req, res) {
  try {
    const { asin } = req.query;

    const googleResults = await got(
      `http://webcache.googleusercontent.com/search?q=cache:amazon.com/dp/${asin}&strip=0&vwsrc=1`
    ).then((e) => e.body);

    const str = he.decode(googleResults.toString().replace(/\"/g, '"'));

    const $ = cheerio.load(str);
    console.log($("a.a-link-normal h2"));
    const details = {
      price: parseFloat(
        $("#price_inside_buybox").text().split(",").join("").replace("$", "")
      ),
      title: $("#productTitle").text().trim(),
      description: $("meta[property='og:description']").attr("content"),
      cover_image: $("meta[property='og:image']").attr("content"),
      rating: $(".reviewCountTextLinkedHistogram").attr("title"),
      images: $(".imgTagWrapper img").attr("data-a-dynamic-image")
        ? Object.keys(
            JSON.parse($(".imgTagWrapper img").attr("data-a-dynamic-image"))
          )
        : "",

      number_of_reviews: $(
        "#productDetails_detailBullets_sections1 #acrCustomerReviewText"
      )
        .text()
        .split(",")
        .join("")
        .replace(" ratings", ""),
    };

    return res.status(200).json({ error: true, data: details });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, message: "could not get amazon info" });
  }
}
