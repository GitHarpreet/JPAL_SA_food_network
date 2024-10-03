// Initialize the map centered on India
var map = L.map('map').setView([20.5937, 78.9629], 5); // India coordinates

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to load and display data from Google Sheets (via SheetDB API)
function loadMapData() {
    fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API_KEY')
        .then(response => response.json())
        .then(data => {
            data.forEach(location => {
                L.marker([location.latitude, location.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${location.locationName}</b><br>
                                <img src="${location.imageUrl}" width="100"><br>
                                ${location.review}<br>Rating: ${location.rating}`);
            });
        })
        .catch(error => console.error('Error loading map data:', error));
}

// Load data when the page loads
loadMapData();

// Form submission handler
document.getElementById('locationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Collect form data
    let formData = {
        locationName: e.target.locationName.value,
        latitude: e.target.latitude.value,
        longitude: e.target.longitude.value,
        imageUrl: e.target.imageUrl.value,
        review: e.target.review.value,
        rating: e.target.rating.value,
    };

    // Send form data to Google Sheets via SheetDB API
    fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API_KEY', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert("Location data saved successfully!");
        loadMapData();  // Reload the map with updated data
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
