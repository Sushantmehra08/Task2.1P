const express = require('express');
const mailgun = require('mailgun-js');
const path = require('path'); // Required to correctly serve the HTML file
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Mailgun configuration
const mg = mailgun({ 
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN 
});

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    const data = {
        from: 'DEV@Deakin <sushant.mehra08@gmail.com>',
        to: email,
        subject: 'Welcome to DEV@Deakin',
        text: 'Thank you for subscribing to DEV@Deakin!',
        html: '<strong>Thank you for subscribing to DEV@Deakin!</strong>'
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('Failed to send welcome email.');
        } else {
            console.log(body);
            res.status(200).send('Welcome email sent successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
