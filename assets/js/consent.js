document.addEventListener("DOMContentLoaded", function() {
    var acceptCookiesButton = document.getElementById("accept-cookies");
    var cookieConsentBanner = document.getElementById("cookie-consent-banner");

    acceptCookiesButton.addEventListener("click", function() {
        // Set a cookie to remember user's consent preference
        document.cookie = "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";

        // Hide the consent banner
        cookieConsentBanner.style.display = "none";
    });

    // Check if user has previously accepted cookies
    if (document.cookie.indexOf("cookies_accepted=true") !== -1) {
        // Hide the consent banner if cookies were previously accepted
        cookieConsentBanner.style.display = "none";
    }
});
