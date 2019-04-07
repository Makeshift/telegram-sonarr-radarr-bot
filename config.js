const nconf = require('nconf');

nconf
    .argv()
    .env()
    .file({
        file: 'config/config.json'
    })
    .required(["sonarr", "radarr"])

nconf.defaults({})

module.exports = nconf;