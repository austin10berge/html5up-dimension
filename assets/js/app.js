const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const cors = require("cors");
require('dotenv').config({path:'../../.env'});
var path = require("path");

// Instantiate the express app
const app = express();
app.use(cors());

// Make the contact page the first page on the app
app.route("/").get(function (req, res) {
    res.sendFile('index.html', { root: path.resolve(__dirname, '../../') });
});

// Port will be 5000 for testing
const PORT = process.env.PORT; //|| 5500;
app.listen(PORT, ("127.0.0.1"), () => {
    console.log(`Listening on port ${PORT}...`);
    console.log(process.env.EMAIL);
    console.log(process.env.PASS);
});

// SMTP Authentication
const Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

// Verify connection
Transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages!");
    }
});

app.post("/send", (req, res) => {
    // 1. 
    let form = new multiparty.Form();
    let data = {};
    console.log("working");
    form.parse(req, function (err, fields) {
        console.log(fields);
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });

        // 2.
        const mail = {
            from: data.name,
            to: process.env.RECIPIENT,
            subject: `A10B | New message from ${data.name}!`,
            text: `You received a new message on your site! Noice!\n\n${data.name} <${data.email}> \n"${data.message}"`,
        };

        // 3.
        Transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send("Something went wrong.");
            } else {
                //res.status(200).redirect(path.resolve('/'));
                res.status(200).redirect('/');
            }
        });
    });
});
