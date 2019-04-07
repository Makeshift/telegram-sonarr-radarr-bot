const nconf = require('nconf');

nconf
    .argv()
    .env()
    .file({
        file: './config/config.json'
    })
    .required(["telegram:botToken", "sonarr", "radarr", "bot"])

nconf.defaults({
    "sonarr:enabled": true,
    "radarr:enabled": true,
    "bot:logLevel": "info"
})

module.exports = nconf;