// If on the view page, display the map
if (document.getElementById('map')) {
    // Initialize the map centered on India
    var map = L.map('map').setView([20.5937, 78.9629], 5); // India coordinates

    // Add OpenStreetMap tiles to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to display location details below the map
    function showLocationDetails(location) {
        const detailsDiv = document.getElementById('location-details');
        detailsDiv.innerHTML = `
            <h2>${location.locationName}</h2>
            <p><strong>Review:</strong> ${location.review}</p>
            <p><strong>Rating:</strong> ${location.rating}</p>
            <img src="${location.imageUrl}" alt="${location.locationName}">
        `;
    }

    // Load Data from Google Sheets via SheetDB API and Display on the Map
    fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API_KEY')
        .then(response => response.json())
        .then(data => {
            data.forEach(location => {
                // Create a marker for each location
                var marker = L.marker([location.latitude, location.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${location.locationName}</b>`);

                // Event listener for marker click
                marker.on('click', function() {
                    showLocationDetails(location);
                });
            });
        })
        .catch(error => console.error('Error loading map data:', error));
}
