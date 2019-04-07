const log = require('../log');
const config = require('../config');
const markup = require('telegraf/markup');
const admin = require('../admin');

module.exports = (scene, stage, bot) => {
    log.verbose("Registering scene", {scene: 'start'});
    const start = new scene('start');

    start.enter(async (ctx, next) => {
        if (ctx.session.authenticated) {
            log.verbose("User is authenticated", {username: ctx.chat.username, id: ctx.chat.id})
            ctx.scene.enter("home");
        } else if (ctx.session.auth && ctx.session.auth.waiting) {
            log.debug("User is spamming the auth button...", {username: ctx.chat.username, id: ctx.chat.id});
            ctx.reply("We already asked an admin if they can accept you. Please be patient.")
        } else {
            log.verbose("Unauthenticated user started session", {username: ctx.chat.username, id: ctx.chat.id});
            ctx.reply(`Hi! Welcome to ${config.get("bot:name")}!`);
            let authMessage = await ctx.reply("You aren't authenticated to use this bot. Would you like to ask the admins for access?", markup.inlineKeyboard([
                    markup.callbackButton('👍 Yes', "yes"),
                    markup.callbackButton('👎 No', "no")
            ]).extra());
            start.action('yes', async (ctx, next) => {
                log.info("User asked to be able to use the bot", {username: ctx.chat.username, id: ctx.chat.id, admins: config.get("telegram:admins")})
                ctx.answerCbQuery();
                await ctx.editMessageText("Status: ⌛ Waiting for admin...");
                ctx.session.auth = {
                    messageId: authMessage.message_id,
                    waiting: true,
                    authenticated: false,
                    username: authMessage.chat.username,
                    id: authMessage.chat.id
                }
                admin.authenticateUser(ctx);
                return next();
            });
            start.action('no', (ctx, next) => {
                log.verbose("User doesn't want to use the bot", {username: ctx.chat.username, id: ctx.chat.id})
                ctx.answerCbQuery();
                ctx.deleteMessage();
                ctx.replyWithMarkdown("Okay! Type `/start` again if you change your mind.");
                start.leave();
                return next();
            })
        }
        next();
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