require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var authRoutes = require("./routes/authRoutes");
// eslint-disable-next-line no-unused-vars
var passportSetup = require("./config/passport-setup");

var cookieSession = require("cookie-session");
var passport = require("passport");

var app = express();



// messing w ejs leave here
// var ejs = require("ejs");
// app.set("view engine", "ejs");

var db = require("./models");

var PORT = process.env.PORT || 3000;






app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["hey"],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session({resave: false}));


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/auth", authRoutes);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;