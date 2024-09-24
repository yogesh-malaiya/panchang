document.getElementById('fetchPanchangBtn').addEventListener('click', async () => {
  const panchangDataDiv = document.getElementById('panchangData');
  const spinner = document.getElementById('spinner');

  // Show spinner and hide data container
  spinner.style.display = 'block';
  panchangDataDiv.style.display = 'none'; // Ensure it's hidden while fetching
  
  try {
    // Fetch user's location using the geolocation API
    const geonameId = await getUserGeonameId(); // Fetch the geonameId from user's location
    
    if (!geonameId) {
      panchangDataDiv.innerHTML = 'Could not determine your location.';
      spinner.style.display = 'none';
      panchangDataDiv.style.display = 'block';
      return;
    }

    // Fetch Panchang data using geoname-id
    const response = await fetch(`/fetch-panchang?geoname-id=${geonameId}`);
    
    if (response.ok) {
      const data = await response.json();

      // Set the respective sections to different divs
      document.getElementById('headerSection').innerHTML = data.header;
      document.getElementById('sunriseMoonriseSection').innerHTML = data.sunriseMoonrise;
      document.getElementById('corePanchangSection').innerHTML = data.corePanchang;
      document.getElementById('auspiciousSection').innerHTML = data.auspicious;
      document.getElementById('inauspiciousSection').innerHTML = data.inauspicious;

      // Hide spinner and show data container
      spinner.style.display = 'none';
      panchangDataDiv.style.display = 'grid'; // Set display to grid after data is fetched
    } else {
      panchangDataDiv.innerHTML = 'Failed to fetch data. Please try again later.';
      spinner.style.display = 'none';
      panchangDataDiv.style.display = 'block';
    }
  } catch (error) {
    panchangDataDiv.innerHTML = 'An error occurred while fetching the data.';
    spinner.style.display = 'none';
    panchangDataDiv.style.display = 'block';
    console.error('Error:', error);
  }
});

// Function to get user's geonameId based on current location
async function getUserGeonameId() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude; // Changed 'lon' to 'lng'
        try {
          const geonameId = await fetchGeoNameId(lat, lng); // Fetch GeoName ID
          resolve(geonameId);
        } catch (error) {
          console.error('Error fetching GeoNames data:', error);
          resolve(null); // Return null in case of error
        }
      }, (error) => {
        console.error('Geolocation error:', error);
        resolve(null); // Return null if geolocation fails
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      resolve(null);
    }
  });
}

// Fetch GeoNames ID using latitude and longitude
async function fetchGeoNameId(lat, lng) {
  const username = 'yogeshmalaiya'; // Your GeoNames username
  const url = `https://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&cities=cities1000&maxRows=1&username=${username}`;

  const response = await fetch(url);
  const data = await response.json();
  
  if (data.geonames && data.geonames.length > 0) {
    return data.geonames[0].geonameId;
  } else {
    throw new Error("No main city found for the given location");
  }
}
