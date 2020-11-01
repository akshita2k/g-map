function initMap() {
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: uluru,
        map: map,
    });
}
//This div will display Google map
const mapArea = document.getElementById('map');

//This button will set everything into motion when clicked
const actionBtn = document.getElementById('showMe');

//This will display all the available addresses returned by Google's Geocode Api
const locationsAvailable = document.getElementById('locationList');

// API_KEY
const __KEY = 'AIzaSyDJGpQUoSLWViuWhKtaYDrCYkUKVUyV1Vs';

//Let's declare our Gmap and Gmarker variables that will hold the Map and Marker Objects later on
let Gmap;
let Gmarker;

//Now we listen for a click event on our button
actionBtn.addEventListener('click', e => {
    // hide the button 
    actionBtn.style.display = "none";
    // call Materialize toast to update user 
    M.toast({
        html: 'fetching your current location',
        classes: 'rounded'
    });
    // get the user's position
    getLocation();
});

//Get Location 
getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, showError, options)

    } else {
        M.toast({
            html: 'Sorry, your browser does not support this feature... Please Update your Browser to enjoy it',
            classes: 'rounded'
        });
    }
}


//Display Location 
displayLocation = (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = {
        lat,
        lng
    }
    showMap(latlng, lat, lng);
    createMarker(latlng);
    mapArea.style.display = "block";
    getGeolocation(lat, lng)
}

//Show map 
showMap = (latlng, lat, lng) => {
    let mapOptions = {
        center: latlng,
        zoom: 17
    };
    Gmap = new google.maps.Map(mapArea, mapOptions);
    Gmap.addListener('drag', function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
    });
    Gmap.addListener('dragend', function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
    });
    Gmap.addListener('idle', function() {
        Gmarker.setPosition(this.getCenter()); // set marker position to map center
        if (Gmarker.getPosition().lat() !== lat || Gmarker.getPosition().lng() !== lng) {
            setTimeout(() => {
                updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
            }, 2000);
        }
    });
}

//Marker for the map
createMarker = (latlng) => {
    let markerOptions = {
        position: latlng,
        map: Gmap,
        animation: google.maps.Animation.BOUNCE,
        clickable: true
            // draggable: true
    };
    Gmarker = new google.maps.Marker(markerOptions);
}

// Displays the different types of error messages
showError = (error) => {
    mapArea.style.display = "block"
    switch (error.code) {
        case error.PERMISSION_DENIED:
            mapArea.innerHTML = "You denied the request for your location."
            break;
        case error.POSITION_UNAVAILABLE:
            mapArea.innerHTML = "Your Location information is unavailable."
            break;
        case error.TIMEOUT:
            mapArea.innerHTML = "Your request timed out. Please try again"
            break;
        case error.UNKNOWN_ERROR:
            mapArea.innerHTML = "An unknown error occurred please try again after some time."
            break;
    }
}

const options = {
    enableHighAccuracy: true
}

//Get geo location
getGeolocation = (lat, lng) => {
    const latlng = lat + "," + lng;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${__KEY}`)
        .then(res => res.json())
        .then(data => populateCard(data.results));
}

//Remove address Cards
function removeAddressCards() {
    if (locationsAvailable.hasChildNodes()) {
        while (locationsAvailable.firstChild) {
            locationsAvailable.removeChild(locationsAvailable.firstChild);
        }
    }
}

//Update the dom
populateCard = (geoResults) => {
    // check if a the container has a child node to force re-render of dom
    removeAddressCards();
    geoResults.map(geoResult => {
        // first create the input div container
        const addressCard = document.createElement('div');
        // then create the input and label elements
        const input = document.createElement('input');
        const label = document.createElement('label');
        // then add materialize classes to the div and input
        addressCard.classList.add("card");
        input.classList.add("with-gap");
        // add attributes to them
        label.setAttribute("for", geoResult.place_id);
        label.innerHTML = geoResult.formatted_address;
        input.setAttribute("name", "address");
        input.setAttribute("type", "radio");
        input.setAttribute("value", geoResult.formatted_address);
        input.setAttribute("id", geoResult.place_id);
        // input.addEventListener('click', e => console.log(123));
        input.addEventListener('click', () => inputClicked(geoResult));
        // finalResult = input.value;
        finalResult = geoResult.formatted_address;
        addressCard.appendChild(input);
        addressCard.appendChild(label)
        return (
            // append the created div to the locationsAvailable div
            locationsAvailable.appendChild(addressCard)
        );
    })
}

// Update Position
updatePosition = (lat, lng) => {
    getGeolocation(lat, lng);
}



//Input 
const inputAddress = document.getElementById('address'),
    inputLocality = document.getElementById('locality'),
    inputPostalCode = document.getElementById('postal_code'),
    inputLandmark = document.getElementById('landmark'),
    inputCity = document.getElementById('city'),
    inputState = document.getElementById('state');

inputClicked = result => {
    result.address_components.map(component => {
        const types = component.types
        if (types.includes('postal_code')) {
            inputPostalCode.value = component.long_name
        }
        if (types.includes('locality')) {
            inputLocality.value = component.long_name
        }
        if (types.includes('administrative_area_level_2')) {
            inputCity.value = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
            inputState.value = component.long_name
        }
        if (types.includes('point_of_interest')) {
            inputLandmark.value = component.long_name
        }
    });
    inputAddress.value = result.formatted_address;
    // to avoid labels overlapping pre-filled input contents
    M.updateTextFields();
    // removes the address cards from the UI
    removeAddressCards();
}