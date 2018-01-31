const request = require('request');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const serviceAccount = require("./google-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var collection = admin.firestore().collection('cryptocurrency');

let options = {
    url: 'http://localhost:5000/uptau-1/us-central1/cryptocurrency/cryptocurrency',
};
request(options, function (err, res, body) {
    if (err) {
        console.log("Something's wrong: ", err);
        return;
    }
    let data = JSON.parse(body);

    let coins = [];
    data.forEach(coin => {
        coins.push({
            id: coin.id,
            symbol: coin.symbol
        });
    });

    coins = coins.slice(1200, 1300);

    coins.forEach( coin => {

        console.log(coin.id);

        let options = {
            url: 'https://coinmarketcap.com/currencies/' + coin.id,
        };

        request(options, function (err, res, data) {

            if (err) {
                console.log("Something's wrong: ", err);
                return;
            }
            const $ = cheerio.load(data);
            let info = {}
            $('ul.list-unstyled a').each(function() {
                let field_name = $(this).text().toLowerCase().replace(/[^A-Z0-9]+/ig, "_");
                info[field_name] = $(this).attr('href');
            });
            console.log(coin.symbol)
            collection.doc(coin.symbol).set({
                info: info
            }, { merge: true })
                .then(function () {
                    console.log("Document successfully written!");
                })
                .catch(function (error) {
                    console.error("Error writing document (" + coin.symbol + ") : ", error);
                    fs.appendFile('error-info.log', JSON.stringify(coin) + "\n", function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                });

        });

    });

});

