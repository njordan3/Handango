# Duohando
### Master branch
Includes all the features implemented in the other branches of this repository:
#### User profile features
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
* Middleware automatically stops unauthorized users from performing requests that has not been allowed to them.

### Lesson features
* Three full lessons with the following topics:
  * Alphabet and Fingerspelling
  * Counting and Numbers
  * Types of Questions
* Each lesson includes:
  * Lecture for learning the material
  * Practice for applying what is learned in the lecture
  * Quiz to be completed to unlock the next lesson
* Lecture features:
  * Each lecture is borrowed from [The Everything Sign Language Book 2nd Edition by Irene Duke](https://www.simonandschuster.com/books/The-Everything-Sign-Language-Book/Irene-Duke/Everything/9781598698831)
  * Lecture progress is saved live to the user's profile so that they can return to where they left off
* Practice features:
  * Contains four different mini-games to help the learning process
  * Includes a webcam component that implements server-side machine learning to identify a few ASL signs
  * Practices are randomly compiled from a small dataset for each mini-game type when the lesson is unlocked
  * Practice progress and answers are saved live to the user's profile so they can return to where they left off with all their past answers in place
  * A practice must be completed for its quiz to be unlocked to the user
* Quiz features:
  * Contains the same mini-games as the practices
  * Contains the same webcam component as the practices
  * Quizzes are randomly compiled from a small dataset for each mini-game when the quiz page is visited
  * Quizzes are timed and will automatically be turned in and graded when time is up
  * Quiz grades must be greater than or equal to 70% in order for the next lesson to be unlocked
  
### Many assets and videos used in the making of these lessons comes from [Dr. Bill's ASL University's](https://www.lifeprint.com/) webpages as well as from [The Everything Sign Language Book 2nd Edition by Irene Duke](https://www.simonandschuster.com/books/The-Everything-Sign-Language-Book/Irene-Duke/Everything/9781598698831)
