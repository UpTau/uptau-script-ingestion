# UpTau Script Ingestion
This folder contains scripts to ingest data into UpTau

## Ingest-coinmarketcap.js
This script calls coinmarketcap API to get the list of tokens and update
the database. 

## Ingest-coinmarketcap-info-once.js
This script crawl coinmarketcap.com to get the information of all tokens, 
by parsing the webpage of each token on coinmarketcap.com.

## Ingest-github-repo-info.js
This script call github API and gather all the repo information