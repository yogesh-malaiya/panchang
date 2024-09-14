const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// Serve static files (script.js, styles.css) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to fetch data from DrikPanchang
async function fetchDataFromDrikPanchang(url) {
  try {
    const response = await axios.get(url);
    const htmlData = response.data;
    return htmlData;
  } catch (error) {
    console.error('Error fetching data from DrikPanchang:', error);
    return null;
  }
}

// Fetch Panchang route
app.get('/fetch-panchang', async (req, res) => {
  try {
    const url = 'https://www.drikpanchang.com/panchang/day-panchang.html?lang=hi';
    const htmlData = await fetchDataFromDrikPanchang(url);

    if (!htmlData) {
      return res.status(500).send('Failed to fetch data from the external source');
    }

    const $ = cheerio.load(htmlData);

    // Remove unwanted elements
    $('img.dpTableElementImage').remove();
    $('span.dpInfoIcon').remove();
    $('img[src="/images/icon/moon/tithi/xmoon_ekadashi_shukla.png.pagespeed.ic.qOmCBkkVMH.png"]').remove();

    // Extract required content from the HTML
    const dpPHeaderId = $('#dpPHeaderId').html();
    const dpSunriseMoonriseCardWrapper = $('.dpSunriseMoonriseCardWrapper').html();
    const dpCorePanchangCardWrapper = $('.dpCorePanchangCardWrapper').html();
    const dpAuspiciousCardWrapper = $('.dpAuspiciousCardWrapper').html();
    const dpInauspiciousCardWrapper = $('.dpInauspiciousCardWrapper').html();

    // Check if any content is missing
    if (!dpPHeaderId || !dpSunriseMoonriseCardWrapper || !dpCorePanchangCardWrapper || !dpAuspiciousCardWrapper || !dpInauspiciousCardWrapper) {
      console.error('Failed to extract some of the panchang data.');
      return res.status(500).json({ error: 'Failed to extract some data' });
    }

    // Send cleaned content as JSON response
    res.json({
      header: dpPHeaderId.trim(),
      sunriseMoonrise: dpSunriseMoonriseCardWrapper.trim(),
      corePanchang: dpCorePanchangCardWrapper.trim(),
      auspicious: dpAuspiciousCardWrapper.trim(),
      inauspicious: dpInauspiciousCardWrapper.trim()
    });
  } catch (error) {
    console.error('Error in /fetch-panchang route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
