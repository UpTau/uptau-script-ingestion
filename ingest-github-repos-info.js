const request = require('request');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const serviceAccount = require("./google-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var collection = admin.firestore().collection('cryptocurrency');

let options = {
    url: 'https://github.com/bitcoin',
};
request(options, function (err, res, body) {
    if (err) return console.log("Something's wrong: ", err);

    const $ = cheerio.load(body);
    let pinned = {}
    $('.pinned-repos-list .d-block a').each(function() {
        let field_name = $(this).text().toLowerCase().replace(/[^A-Z0-9]+/ig, "_");
        pinned[field_name] = true
    });

    let repos = {}
    $('#org-repositories li').each(function() {
        console.log($(this))
    });

});

