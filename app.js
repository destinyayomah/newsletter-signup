const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const client = require("@mailchimp/mailchimp_marketing");
const { log } = require('console');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const apiKey = 'b72234f4a136cb290e143bd11c9dd871-us12';
const listID = 'cf0f6ae6c6';
const url = 'https://us12.api.mailchimp.com/3.0/';

client.setConfig({
    apiKey: apiKey,
    server: "us12"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            maerge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    }

    async function run() {
        try {
            const response = await client.lists.addListMember(listID, {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            });

            if (response) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        } catch (e) {
            if (e.status == 400) {
                res.sendFile(__dirname + '/failure.html');
            }
        }
    }

    run();

});

app.post('/home', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000);