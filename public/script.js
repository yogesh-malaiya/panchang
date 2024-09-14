document.getElementById('fetchPanchangBtn').addEventListener('click', async () => {
  const panchangDataDiv = document.getElementById('panchangData');
  const spinner = document.getElementById('spinner');

  // Show spinner and hide data container
  spinner.style.display = 'block';
  panchangDataDiv.style.display = 'none'; // Ensure it's hidden while fetching

  try {
    const response = await fetch('/fetch-panchang');
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
