# spaceapps-aircheck
An implementation of the Aircheck challenge from [Space Apps 2016](https://2016.spaceappschallenge.org/challenges/earth/aircheck).

## Installation and running
1. Install `node`, `npm`, and `mongo`
2. Run `mongod` on the standard port `27017`
3. Run `npm install` both in `client` and `server`
4. Run `npm run update-schema` in `server` in order to export the GraphQL schema from the server and make it available to the client
5. Run `npm start` both in `client` and `server`

## User Documentation
Product overview is available in the wiki: [Using Boreas](https://github.com/asteasolutions/spaceapps-aircheck/wiki/Using-Boreas)

## Notes
* Make sure to run `npm run update-schema` every time when you change the GraphQL schema on the server.
