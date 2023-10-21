const fetch = require('node-fetch'); // Use the 'node-fetch' library for making HTTP requests in Node.js

// API endpoint and query parameters
const apiUrl = 'https://api.kroger.com/v1/products';
const searchTerm = 'milk'; // Replace with your desired search term
const locationId = '01400943'; // Replace with the desired location ID
const limit = 10; // Number of products to return

// Replace 'YOUR_ACCESS_TOKEN' with your actual API access token
const accessToken = 'grocerygettersetter-8572354113d1f09c61936f686e1e059e7287398612144538600';

// Define the headers for the API request
const headers = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${accessToken}`
};

// Construct the URL with query parameters
const apiUrlWithParams = `${apiUrl}?filter.term=${searchTerm}&filter.locationId=${locationId}&filter.limit=${limit}`;

// Make the API request
fetch(apiUrlWithParams, { method: 'GET', headers })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  })
  .then(data => {
    // Process the API response data, including price information
    console.log('Product information:', data);
  })
  .catch(error => {
    console.error('API request error:', error.message);
  });
