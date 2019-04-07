const log = require('../log');
const config = require('../config');
const telegraf = require('telegraf');
const extra = require('telegraf/extra');
const markup = require('telegraf/markup');

module.exports = (scene, stage, bot) => {
    log.verbose("Registering scene", {scene: 'start'});
    const start = new scene('start');

    start.enter(async (ctx) => {
        if (ctx.session.authenticated) {
            ctx.scene.enter("home");
        } else if (ctx.session.auth && ctx.session.auth.waiting) {
            ctx.reply("We already asked an admin if they can accept you. Please be patient.")
        } else {
            ctx.reply(`Hi! Welcome to ${config.get("bot:name")}!`);
            let authMessage = await ctx.reply("You aren't authenticated to use this bot. Would you like to ask the admins for access?", markup.inlineKeyboard([
                    markup.callbackButton('👍 Yes', "yes"),
                    markup.callbackButton('👎 No', "no")
            ]).extra());
            start.action('yes', async (ctx, next) => {
                ctx.answerCbQuery();
                await ctx.editMessageText("Status: ⌛ Waiting for admin...");
                await ctx.editMessageReplyMarkup(authMessage.chat.id, authMessage.message_id, null, {});
                ctx.session.auth = {
                    messageId: authMessage.message_id,
                    waiting: true,
                    authenticated: false,
                    username: authMessage.chat.username,
                    id: authMessage.chat.id
                }
                return next();
            });
            start.action('no', (ctx, next) => {
                ctx.answerCbQuery();
                ctx.answerCbQuery("Okay!");
                start.leave();
                return next();
            })
        }
    })


    stage.register(start);
    bot.command('start', (ctx) => ctx.scene.enter('start'));
}

                // m.inlineKeyboard([
                //     markup.callbackButton('👍 Yes', "yes"),
                //     markup.callbackButton('👎 No', "no")
                // ])

//             const askForAuthMenu = new inlineMenu(() => "You aren't authenticated to use this bot. Would you like to ask the admins for access?")
//             askForAuthMenu.simpleButton("👍 Yes", "Yes", {
//                 doFunc: async ctx => {
//                     ctx.session.waitingAuth = true;
//                     ctx.answerCbQuery("Okay! We've sent a message to the admins and we'll ping you when you're accepted.")
//                 }
//             });
// 
//             bot.use(askForAuthMenu.init({
//                 backButtonText: "⬅️ Back"
//             }));

// const askForAuthMenu = telegraf.Extra.markdown().markup((m) => m.keyboard([
//     m.callbackButton('👍 Yes', "Yes"),
//     m.callbackButton('👎 No', "No")
// ]).extra());