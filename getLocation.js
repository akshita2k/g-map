getLocation = () => {
    // check if user's browser supports Navigator.geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( * success, error, [options] * )
        navigator.geolocation.getCurrentPosition(displayLocation, showError, options);
    } else {
        M.toast({ html: "Sorry, your browser does not support this feature... Please Update your Browser to enjoy it", classes: "rounded" });
    }
}