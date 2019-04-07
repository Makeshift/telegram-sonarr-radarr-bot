const log = require('../log');
const config = require('../config');

module.exports = (scene, stage, bot) => {
    log.verbose("Registering scene", {scene: 'start'});
    const start = new scene('start');
    stage.register(start);
    bot.command('start', (ctx) => ctx.scene.enter('start'));
}