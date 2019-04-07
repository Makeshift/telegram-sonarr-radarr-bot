const { createLogger, format, transports } = require('winston');
const { combine, json, timestamp, printf, splat, colorize } = format;
const config = require('./config');
const tty = require('tty');
const { SPLAT } = require('triple-beam');
const { highlight } = require('cli-highlight');

function formatForTTY() {
    if (tty.isatty(process.stdout.fd)) {
        return combine(colorize(), timestamp(), json(), cliFormat)
    } else {
        return combine(timestamp(), splat(), json());
    }
}

const cliFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message} - ${info[SPLAT] ? highlight(JSON.stringify(info[SPLAT], null, 2), {language: 'json', ignoreIllegals: true}) : ""}`;
});

// Since this is designed to run in a container mostly, I don't really care about logging to disk.
// If this is needed by somebody, raise an issue and I'll make it an option.

// const logfileFormat = printf(info => {
//     return `${info.level}: ${info.message} - ${info[SPLAT] ? JSON.stringify(info[SPLAT], null, 2) : null}`;
// });
// function getDate() {
//     let d = new Date();
//     return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}T${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`
// }

const log = createLogger({

    transports: [
        new transports.Console({
            timestamp: true,
            showLevel: true,
            level: config.get("bot:logLevel"),
            format: formatForTTY()
        })/*,
        new transports.File({
            filename: `logs/run.${getDate()}.log`,
            format: combine(json(), logfileFormat),
            level: "debug"
        })*/
    ]
});



module.exports = log;