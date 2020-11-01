// Displays the different error messages
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
    //Makes sure location accuracy is high
const options = {
    enableHighAccuracy: true
}