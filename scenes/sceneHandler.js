const query = require('./query');
const start = require('./start');
const home = require('./home');
const log = require('../log');
const config = require('../config');

module.exports = (scene, stage, bot) => {
    query(scene, stage, bot);
    start(scene, stage, bot);
    home(scene, stage, bot);
}