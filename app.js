require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
var engines = require('consolidate');
const userRoutes = require("./src/userroute");
const cors = require("cors");
const { isSignedIn} = require("./src/usercontroller");
const app = express();
var cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//   app.get("/", (req, res) => {
//     res.send("Hello World");
//   });
app.use(express.static(path.join(__dirname, 'src')));

app.get('/login', (req, res) => {
    res.clearCookie("token");
    res.render('login');
});
app.get('/index', (req, res) => {
    res.render('index');
});

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

app.use("/", userRoutes);

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe',isSignedIn, (req, res) => {
    const subscription = req.body

    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
});

app.set('port', process.env.PORT || 7000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});