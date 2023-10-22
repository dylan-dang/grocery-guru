import { config, getJson } from "serpapi";

config.api_key = "28ffbb010d94913459f3d815f6eaa6bf3f2d1b617615f0488b1a3f256b0d1618"; //your API key from serpapi.com
const resultsLimit = 10; // hardcoded limit for demonstration purpose

export async function getTargetData(term: string) {
  const url = new URL("https://api.redcircleapi.com/request");
  const searchParams = new URLSearchParams({
    api_key: "268DB21B52E04D5EA036CF12C013BC77",
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

import { GraphQLClient, gql } from 'graphql-request';

export async function getHebData(term: string) {
    // Create a GraphQL client and set headers
    const client = new GraphQLClient('https://www.heb.com/graphql');
    client.setHeaders({
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json',
        Connection: 'Close',
        Cookie: 'visid_incap_.... (YOUR COOKIE); USER_SELECT_STORE=false; CURR_SESSION_STORE=92',
        Host: 'www.heb.com',
        'User-Agent': 'Paw/3.3.3 (Macintosh; OS X/12.1.0) GCDHTTPRequest',
    });

    // Define the GraphQL query with a query variable "term"
    const query = gql`
        query($term: String!) {
            shopNavigation(searchTerm: $term) {
                id
                shortDisplayName
                displayName
                subCategories {
                    id
                    displayName
                    shortDisplayName
                }
            }
        }
    `;

    const variables = { term };

    try {
        // Make the GraphQL request and pass the query variables
        const result = await client.request(query, variables);
        return result;
    } catch (error) {
        console.log(error);
        throw error; // You can handle the error as needed in your application
    }
}