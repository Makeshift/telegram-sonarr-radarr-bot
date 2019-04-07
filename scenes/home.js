const log = require('../log');
const config = require('../config');

module.exports = (scene, stage, bot) => {
    log.verbose("Registering scene", {scene: 'home'});
    const home = new scene('home');
    stage.register(home);
    bot.command('home', (ctx) => ctx.scene.enter('home'));
}