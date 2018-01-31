'use strict'
const request = require('request');
const admin = require('firebase-admin');
const serviceAccount = require("./google-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var collection = admin.firestore().collection('cryptocurrency');


const project = 'bitcoin';
const symbol = 'BTC';
const options = {
    url: `https://api.github.com/orgs/${project}/repos?type=public`,
    headers: {'User-Agent': 'request'}
};


// Other API that I can call
//     'https://api.github.com/repos/bitcoin/bitcoin/stats/commit_activity',
//     'https://api.github.com/repos/bitcoin/bitcoin/stats/contributors',
//     'https://api.github.com/repos/bitcoin/bitcoin/stats/code_frequency',
//     'https://api.github.com/repos/bitcoin/bitcoin/stats/punch_card',
//     'https://api.github.com/repos/bitcoin/bitcoin/pulls',
//     'https://api.github.com/repos/bitcoin/bitcoin/subscribers',


request(options, function (err, res, body) {
    if (err) return console.log(err);
    let data = JSON.parse(body);

    const repos = [];
    data.forEach(repo => {

        repos.push({
            name: repo.name,
            stars: repo.stargazers_count,
            watchers: repo.watchers_count,
            forks: repo.forks,
            full_name: repo.full_name,
            id: repo.id
        });
    });

    collection.doc(symbol).set({
        repos: repos
    }, {merge: true})
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document (" + symbol + ") : ", error);
        });

});