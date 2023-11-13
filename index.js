require('dotenv').config();
const path = require('path');
const database = require('./databases/dbConnect');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();
app.use(cors());


// Import controllers and routes
const authRoutes = require('./routes/auth-routes');
const homeController = require('./controllers/homeController');
const adminRoute = require('./routes/adminRoute');
const apiv1Route = require('./routes/api-v1-Route');


// Set View Engine and Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieSession({
  maxAge:24*60*60*1000*30,
  keys:['wallmagappisgood']
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Body Parser and Static Path
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Define Routes
app.use('/api/v1', apiv1Route);
app.use('/admin', adminRoute);
app.use('/auth',authRoutes);

// Login Route for the Root Path
app.get('/',homeController.getlogin);

// 404 Error Handling Middleware
app.use((req, res) => {
  res.status(404).render('error404.ejs');
});

const port = process.env.PORT || 3000; // Use the specified port or default to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
