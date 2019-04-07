const log = require('./log');
const config = require('./config');
const markup = require('telegraf/markup');
let bot = config.get("bot:bot");
//log.info("User has requested access, sent to Admins", {user: ctx.chat.username, id: ctx.chat.id, admins: config.get("telegram:admins")});

module.exports = {
    getAuthFromAdmins: getAuthFromAdmins
}

function getAuthFromAdmins(userCtx) {
    config.get("telegram:admins").map(async admin => {
        let authMessage = await bot.sendMessage(admin, `A user has asked to join the bot: \nUsername: ${userCtx.chat.username}\nID: ${userCtx.chat.id}`, markup.inlineKeyboard([
                    markup.callbackButton('👍 Yes', "yesAcceptUser"),
                    markup.callbackButton('👎 No', "noDenyUser")
            ]).extra());

            bot.action('yesAcceptUser', async (ctx, next) => {
                //TODO: Unfinished, finish when less tired
                log.info("Admin has given a user access", {username: userCtx.chat.username, id: userCtx.chat.id, admin: admin})
                ctx.answerCbQuery();
                await ctx.editMessageText(`User ${userCtx.chat.username} accepted by ${await bot.telegram.getChat(admin)}`);
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
            bot.action('no', (ctx, next) => {
                log.verbose("User doesn't want to use the bot", {username: ctx.chat.username, id: ctx.chat.id})
                ctx.answerCbQuery();
                ctx.deleteMessage();
                ctx.replyWithMarkdown("Okay! Type `/start` again if you change your mind.");
                start.leave();
                return next();
            })
    })
}