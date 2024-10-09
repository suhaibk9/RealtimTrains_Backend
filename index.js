const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;

const authHeader =
  'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

// Configure CORS to allow requests from your frontend URL
app.use(cors({
  origin: 'https://realtim-trains-frontend.vercel.app' // Allow your frontend URL
}));

// Existing route for station search
app.get('/search/:station', async (req, res) => {
  const station = req.params.station;

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

// New route for fetching service information
app.get('/service/:serviceUid/:year/:month/:day', async (req, res) => {
  const { serviceUid, year, month, day } = req.params;

  console.log(
    `Requesting service information for UID: ${serviceUid} on date: ${year}-${month}-${day}`
  );

  const endpoint = `https://api.rtt.io/api/v1/json/service/${serviceUid}/${year}/${month}/${day}`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: authHeader,
        'Accept-Encoding': 'gzip',
      },
    });
    console.log(`Received service data for UID: ${serviceUid}`);
    return res.status(200).json(response.data); // Send JSON response
  } catch (error) {
    console.error(`Error fetching service data for UID: ${serviceUid}`, error);
    res.status(500).send('Error fetching service data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
