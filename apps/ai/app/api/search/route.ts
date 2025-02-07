import { load } from "cheerio";
import axios from "axios";

export async function POST(req: Request) {
  try {
      const json = await req.json();
      const { query } = json;

      const url = "https://www.bing.com/search?q=" + query;
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      });

      const $ = load(response.data);
      const searchResults: any = [];

      $('.b_algo').each((i, element) => {
        const title = $(element).find('h2 > a').text();
        const link = $(element).find('h2 > a').first().attr('href');

        if (title && link) {
          searchResults.push({
            title,
            link,
          });
        }
      });

      return Response.json({ results: searchResults });  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
