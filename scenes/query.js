const log = require('../log');
const config = require('../config');

module.exports = (scene, stage, bot) => {
    log.verbose("Registering scene", {scene: 'query'});
    const query = new scene('query');
    stage.register(query);
    bot.command('query', (ctx) => ctx.scene.enter('query'));
}