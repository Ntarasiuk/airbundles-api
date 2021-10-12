// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import _ from "lodash";
export default async function handler(req, res) {
  try {
    const { asin } = req.query;
    var rx = /(?<=\.\_)(.*)(?=\.)/;

    const googleResults = await axios(
      `https://www.googleapis.com/customsearch/v1?exactTerms=${asin}&cx=abe850e7fc8ce0f7a&key=AIzaSyCgtjvgqJwMNxmkaxcS148R8dBLnfR8Sa8`
    ).then((e) => e.data);
    const formattedResults = {
      engine: "Amazon",
      cover_image: _.get(
        googleResults,
        'items[0].pagemap.metatags[0]["og:image"]'
      ),
      photo_url:
        (_.get(googleResults, "items[0].pagemap.scraped[0].image_link") &&
          _.get(googleResults, "items[0].pagemap.scraped[0].image_link", "")
            .replace(rx, "")
            .replace("_.", "")) ||
        _.get(googleResults, "items[0].pagemap.cse_image[0].src", "")
          .replace(rx, "")
          .replace("_.", ""),
      title: _.get(googleResults, 'items[0].pagemap.metatags[0]["og:title"]'),
      url: `https://www.amazon.com/dp/${
        _.get(googleResults, "items[0].link").split("/dp/")[1]
      }`,
      asin:
        _.get(googleResults, "items[0].link") &&
        _.get(googleResults, "items[0].link").split("/dp/")[1],
    };

    if (_.get(googleResults, "items[0]")) {
      return res.status(200).json({
        results: formattedResults,
        raw: _.get(googleResults, "items[0]"),
      });
    } else {
      console.log("Google search Amazon failed");
      return res
        .status(500)
        .json({ error: true, message: "could not get amazon info" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: true, message: "could not get amazon info" });
  }
}
