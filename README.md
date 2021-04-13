# Duohando
### Web-Servers Branch (pre Angular merge)
Includes the full implementation of backend user profiles with the following features:
* Three different login types
  * Email/password
  * Google Account
  * Facebook Account
* Optional two factor authentication using [Speakeasy](https://www.npmjs.com/package/speakeasy)
* Automatic emails that are used for:
  * Email verification
  * Notification about a security concern from an account detail being changed
  * Link to disable an account in the case that an account is stolen
* The ability to change aspects of an account while logged in:
  * Change email
  * Change password
  * Change to Google account
  * Change to Facebook account
  * Change to email/password account
  * Enable two factor authentication
* The ability to change some login information of an account when login info is forgotten:
  * Forgot email
  * Change password

##### Lessons were just beginning to be implemented with progress being updated live on the user's profile.
##### Middleware automatically stops unauthorized users from performing requests that has not been allowed to them.
##### All of this is complete with beautiful, unstyled HTML user interface merely for testing purposes prior to a proper front-end being implemented.
