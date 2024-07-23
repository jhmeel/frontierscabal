import express from 'express'
import { authenticator } from '../middlewares/authenticator.js'
import { lcl_signup } from '../handlers/signupHandlers/lcl_signup.js'
import { ref_signup } from '../handlers/signupHandlers/ref_signup.js'
import { logoutUser } from '../handlers/loginHandlers/lcl_login.js'
import { loginUser } from '../handlers/loginHandlers/lcl_login.js'
import { connectWithUser } from '../handlers/userHandler.js'
import { getUserDetails } from '../handlers/userHandler.js'
import { getAccountDetails } from '../handlers/userHandler.js'
import { getUserDetailsById } from '../handlers/userHandler.js'
import { getAllUsers } from '../handlers/userHandler.js'
import { searchUsers } from '../handlers/userHandler.js'
import { updatePassword } from '../handlers/userHandler.js'
import { updateProfile } from '../handlers/userHandler.js'
import { forgotPassword } from '../handlers/userHandler.js'
import { resetPassword } from '../handlers/userHandler.js'
const User = express()

User.route('/signup').post(lcl_signup)

User.route('/signup/:referralCode').post(ref_signup)


//login        
User.route('/login').post(loginUser)

//logout
User.route('/logout').get(logoutUser)

//micellaneous

User.route('/profile').get(authenticator, getAccountDetails)

User.route('/connection/:id').get(authenticator, connectWithUser)

User.route('/user/:username').get(authenticator, getUserDetails)

User.route('/userdetails/:id').get(authenticator, getUserDetailsById)


User.route('/users/suggested').get(authenticator, getAllUsers)

User.route('/users').get(authenticator, searchUsers)

//User.route('/connect/:id').get(connectWithUser)

User.route('/update/profile').put(authenticator, updateProfile)

User.route('/update/password').put(authenticator, updatePassword)

User.route('/password/forgot').post(forgotPassword)

User.route('/password/reset/:token').put(resetPassword)


export { User }