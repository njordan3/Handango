//Google API
function onGoogleSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

//Facebook API
window.fbAsyncInit = function() {
    FB.init({
        appId            : '370584830733552',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v8.0'
    });
};
function onFacebookSignIn() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log('Successful login for: ' + response.name);
    
            });
        } else {
            // The person is not logged into your app or we are unable to tell.
            console.log('Unsucessful login...');
        }
    });
}
//===========