import dotenv from "dotenv";
import { config, getJson } from "serpapi";
dotenv.config();
config.api_key = process.env.API_KEY ?? null; //your API key from serpapi.com
const resultsLimit = 10; // hardcoded limit for demonstration purpose

export async function getTargetData(term: string) {
  const url = new URL("https://api.redcircleapi.com/request");
  const searchParams = new URLSearchParams({
    api_key: "7AEE896443E54182B77E3C2F2B631561",
    type: "search",
    search_term: term,
    sort_by: "price_low_to_high",
  });
  url.search = searchParams.toString();
  const req = await fetch(url);
  return await req.json();
}

export async function getWalmartData(term: string) {
  const engine = "walmart"; // search engine
  const params = {
    query: term, 
    page: 1, 
    store_id: "4554",
    //other parameters: https://serpapi.com/walmart-search-api#api-parameters
    sort: "price_low",
  };

  const getResults = async () => {
    let results: {
      fixedQuery: any;
      organicResults: any[];
    } = {
      fixedQuery: null,
      organicResults: [],
    };
    while (results.organicResults.length < resultsLimit) {
      const json = await getJson(engine, params);
      if (!results.fixedQuery)
        results.fixedQuery = json.search_information?.spelling_fix;
      if (json.organic_results) {
        results.organicResults.push(...json.organic_results);
        params.page += 1;
      } else break;
    }
    return results;
  };

  getResults().then((result) => console.dir(result, { depth: null }));
}
