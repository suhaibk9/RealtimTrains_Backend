
const express = require('express');
const axios = require('axios'); 
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;

app.get('/search/:station', async (req, res) => {
  const station = req.params.station;
  const authHeader =
    'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  console.log(`Requesting data for station: ${station}`);

  const endpoint = `https://api.rtt.io/api/v1/json/search/${station}`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: authHeader,
        'Accept-Encoding': 'gzip',
      },
    });
    console.log(`Received data for station: ${station}`);
    return res.status(200).json(response.data); // Send JSON response
  } catch (error) {
    console.error(`Error fetching train data for station: ${station}`, error);
    res.status(500).send('Error fetching train data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
