const dotenv = require('dotenv');
dotenv.config();
const publicIp = require('public-ip');
const ip;
(async () => {
    ip = (await publicIp.v4());
    console.log("***** IP address: "+ip+"*******")
})();
console.log(`Your port is ${process.env.IP_ADDRESS}`);

let express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    bodyParser = require('body-parser');

//Authentication packages
let session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
let passport = require('passport');

//Adding body parser for handling request and response objects.
app.use(bodyParser.urlencoded({ //parse url encoded body
    //use is a method to configure the middleware used by the routes of the Express HTTP server object. The method is defined as part of Connect that Express is based upon.
    extended: true //use qs library; advanced than query string library
}));
app.use(bodyParser.json()); //body parser is an existing middleware function
//middleware gives you access to req and res in the apps request

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

const db = require("./app/models");
db.sequelize.sync();

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'kalyan@47RAO',
    database: 'cloud_assignment_1'
};
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
    // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

//Enabling CORS
app.use(function (req, res, next) { //next is a function that calls next middleware function;
    res.header("Access-Control-Allow-Origin", "http://"+ip);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Initialize app
let initApp = require('./app/app');
initApp(app);

app.listen(port);
console.log('Server for Cloud Assignment-1 started on: ' + port);

module.exports = app