// Get references to form fields
const latitudeField = document.getElementById('latitude');
const longitudeField = document.getElementById('longitude');
const locationStatus = document.getElementById('location-status');
const locationButton = document.getElementById('get-location-btn');

// Geolocation function
locationButton.addEventListener('click', function () {
    if (navigator.geolocation) {
        locationStatus.textContent = "Getting your location...";
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        locationStatus.textContent = "Geolocation is not supported by this browser.";
    }
});

function successCallback(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    latitudeField.value = lat;
    longitudeField.value = lon;
    locationStatus.textContent = `Location captured: Latitude ${lat}, Longitude ${lon}`;
}

function errorCallback(error) {
    locationStatus.textContent = "Unable to retrieve your location. Please try again.";
}

// Submit Form Data to Google Sheets via SheetDB API (with image upload handling)
document.getElementById('locationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const locationName = e.target.locationName.value;
    const latitude = e.target.latitude.value;
    const longitude = e.target.longitude.value;
    const review = e.target.review.value;
    const rating = e.target.rating.value;
    const imageFile = e.target.image.files[0];  // Get the uploaded image file

    // Check if the image file is available
    if (!imageFile) {
        alert("Please upload an image.");
        return;
    }

    // Upload image to a free image hosting service (e.g., Imgur API)
    const formData = new FormData();
    formData.append('image', imageFile);

    fetch('https://api.imgur.com/3/upload', {
        method: 'POST',
        headers: {
            Authorization: 'Client-ID YOUR_IMGUR_CLIENT_ID',
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // After image upload, get the image URL
            const imageUrl = data.data.link;

            // Prepare form data to submit to SheetDB (including image URL)
            const formData = {
                locationName,
                latitude,
                longitude,
                imageUrl,  // Use the uploaded image URL
                review,
                rating
            };

            // Submit the data to SheetDB
            return fetch('https://sheetdb.io/api/v1/YOUR_SHEETDB_API_KEY', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
        } else {
            throw new Error("Image upload failed.");
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert("Location data saved successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
