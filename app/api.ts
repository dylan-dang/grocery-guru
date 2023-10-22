import { config, getJson } from "serpapi";

config.api_key = "28ffbb010d94913459f3d815f6eaa6bf3f2d1b617615f0488b1a3f256b0d1618"; //your API key from serpapi.com
const resultsLimit = 10; // hardcoded limit for demonstration purpose

export async function getTargetData(term: string) {
  const url = new URL("https://api.redcircleapi.com/request");
  const searchParams = new URLSearchParams({
    api_key: "1DE112243EB84F1AB70D855A7146AC18",
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
}
