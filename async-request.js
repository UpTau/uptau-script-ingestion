'use strict'
const request = require('request');
const async = require('async');

const urls = [
    `https://api.github.com/orgs/bitcoin/repos?type=public`
];

function httpGet(url, callback) {
    const options = {
        url :  url,
        json : true,
        headers: { 'User-Agent': 'request' }
    };
    request(options,
        function(err, res, body) {
            callback(err, body);
        }
    );
}

async.map(urls, httpGet, function (err, res){
    if (err) return console.log(err);
    console.log(res[5]);
});