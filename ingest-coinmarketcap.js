const request = require('request');
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require("./google-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var collection = admin.firestore().collection('cryptocurrency');

const options = {
    url: 'https://api.coinmarketcap.com/v1/ticker/',
};
request(options, function (err, res, body) {
    if (err) {
        console.log("Something's wrong: ", err);
        return;
    }

    let data = JSON.parse(body);


    data.forEach(coin => {
        collection.doc(coin.symbol).set({
            rank: parseInt(coin.rank),
            '24h_volume_usd': parseFloat(coin['24h_volume_usd']),
            price_usd: parseFloat(coin.price_usd),
            market_cap_usd: parseFloat(coin.market_cap_usd),
            percent_change_7d: parseFloat(coin.percent_change_7d),
            percent_change_24h: parseFloat(coin.percent_change_24h),
            total_supply: parseFloat(coin.total_supply),
            last_updated: parseFloat(coin.last_updated),
            symbol: coin.symbol,
            available_supply: parseFloat(coin.available_supply),
            percent_change_1h: parseFloat(coin.precent_change_1h),
            name: coin.name,
            id: coin.id,
            price_btc: parseFloat(coin.price_btc)
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document (" + coin.symbol + ") : ", error);
                fs.appendFile('error.log', coin.symbol + "\n", function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            });
    });

});
