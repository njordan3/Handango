**==============[FOR NOT LOGGED IN]==============**
* **HOME PAGE:** Basically an advertisement for Handango; why people should use it
* **ABOUT PAGE:** Details about lessons and account information; Q&A?
* **FORGOT PASSWORD PAGE:** input an email; a secret needs to get embedded in that page
* **CHANGE PASSWORD PAGE:** input a new password
* **FORGOT EMAIL PAGE:** input username
* **BAD REQUEST PAGE:** User tried a route that doesn't do anything so show them an error

**==============[FOR LOGGED IN]==============**
* **2FA PAGE OR POPUP?:** input a 6 digit code
* **DASHBOARD PAGE:** User can see and choose the lessons that they have unlocked and information about the lessons
* **SETTINGS PAGE:** User can change their account information
    * Enable 2FA: Button is clicked which will show a QR code image and a string to the user, and they must input a 6 digit code in order to enable 2FA
    * Change Email: Input current email and a new email; this should return the user to the home page
    * Change Password: Input current password and confirm new password; this should return the user to the home page
    * Change from a Google/Facebook account to an email account: Input a username, new email, and password; this should return the user to the home page
    * Change from a Google account to Facebook account: Press button
    * Change from a Facebook account to a Google account: Press button
* **LESSONS IN GENERAL:** User can return to the last part of the lesson (from practice back to lecture) at any time; User can return to the dashboard at any time; user can logout at any time
