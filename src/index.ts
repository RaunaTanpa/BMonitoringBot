/* eslint-disable new-cap */
const Telegraf = require( 'telegraf');
const {Extra} = Telegraf;

import * as middleware from './middleware';
import * as commands from './commands';
import * as permissions from './permissions';
import * as inline from './inline';
import * as text from './text';
import * as files from './files';
import config from '../config/config';
import * as error from './error';
const dataService = require('./dataService');

// Init error handling
error.init();

// Create new Telegraf() with token
const bot = new Telegraf(config.bot_token);

// TODO: Unit testing
const testing = false;
if (testing) {
  const {tests} = require('../tests/testing');
  tests(bot);
}

// Use session and check for permissions on message
bot.use(permissions.currentSession());
bot.use((ctx, next) => permissions.checkPermissions(ctx, next, config));

// Init category keys
const keys = inline.initInline(bot, config);

// Set bots username
bot.telegram.getMe().then((botInfo) => bot.options.username = botInfo.username);

// Bot commands
bot.command('open', (ctx) => commands.openCommand(ctx));
bot.command('close', (ctx) => commands.closeCommand(bot, ctx));
bot.command('ban', (ctx) => commands.banCommand(bot, ctx));
bot.command('unban', (ctx) => commands.unbanCommand(bot, ctx));
bot.command('start', ctx => {
    logMsg(ctx);
    dataService.registerUser(ctx);
    var userid = ctx.from.id,
        pesan = `<b>🌏 Choose Language</b>\n`
                pesan += `•❂•─•─•❂•─•❂••❂•─•❂•─•─•❂•\n\n`
                pesan += `🆔 <b>Name:</b> ${ctx.from.first_name}\n`
                pesan += ` \u251c <b>Username:</b> @${ctx.from.username}\n`
                pesan += ` \u251c <b>ID Telegram:</b> <code>${userid}</code>\n`
                pesan += ` \u2514 <b>Link:</b> <a href="https://t.me/BmonitoringBotBot?start=${userid}">Click Here</a>\n\n`
                pesan += `👁‍🗨 Hello <b>${ctx.from.first_name}</b>, Welcome to <b>Bot Monitoring</b>\n<b>🌏 Please Choose your Language</b>\n\n`
                pesan += `•❂•─•─•❂•─•❂••❂•─•❂•─•─•❂•\n\n`

            ctx.replyWithPhoto("https://pics.me.me/choose-language-ii-no-your-language-help-with-the-translation-60857888.png",
            Extra.load({caption: `${pesan}`,
                parse_mode: 'HTML'
            }).markup((m) => m.inlineKeyboard([
                    [m.callbackButton('🇬🇧 English','English'),m.callbackButton('🇩🇪 Deutsch','Germany'),m.callbackButton('🇮🇩 Indonesian','Indonesian')],
                    [m.callbackButton('🇷🇺 Pусский','Russian'),m.callbackButton('🇮🇹 Italiano','Italy'),m.callbackButton('🇰🇷 한국어','Korean')],
                    [m.callbackButton('🇲🇾 Malay','Malaysian'),m.callbackButton('🇪🇦 Español','Spanish'),m.callbackButton('🇫🇷 France','France')],
                    [m.callbackButton('🇧🇷 Português','Brazilian'),m.callbackButton('🇵🇭 Tagalog','Philippines'),m.callbackButton('🇮🇳 हिन्दी','Hindi')],
                    [m.callbackButton('🇸🇦 العربية','Arabian'),m.callbackButton('🇯🇵 日本','Japan'),m.callbackButton('🇵🇱 Polska','Poland')]
                    ])
                ))
    logOutMsg(ctx, pesan);
});
bot.command('/start', (ctx) => {
  ctx.session.mode = undefined;
  ctx.session.modeData = undefined;
  if (ctx.chat.type == 'private') {
    ctx.reply(config.language.startCommandText);
    if (config.categories.length > 0)
      setTimeout(() => ctx.reply(config.language.services, inline.replyKeyboard(keys)), 500);    
  } else ctx.reply(config.language.prvChatOnly);
});
bot.command('id', (ctx) => ctx.reply(ctx.from.id + ' ' + ctx.chat.id));
bot.command('faq', (ctx) => ctx.reply(config.language.faqCommandText, Extra.HTML()));
bot.command('help', (ctx) => ctx.reply(config.language.helpCommandText, Extra.HTML()));

// Bot ons
bot.on('callback_query', (ctx) => inline.callbackQuery(bot, ctx));
bot.on('photo', (ctx) => middleware.downloadPhotoMiddleware(bot, ctx, () => 
  files.fileHandler('photo', bot, ctx)));
bot.on('video', (ctx) => middleware.downloadVideoMiddleware(bot, ctx, () => 
  files.fileHandler('video', bot, ctx)));
bot.on('document', (ctx) => middleware.downloadDocumentMiddleware(bot, ctx, () => 
  files.fileHandler('document', bot, ctx)));

// Bot regex
bot.hears(config.language.back, (ctx) => ctx.reply(config.language.services, inline.replyKeyboard(keys)));
bot.hears('testing', (ctx) => text.handleText(bot, ctx, keys));
bot.hears(/(.+)/, (ctx) => text.handleText(bot, ctx, keys));

// Catch bot errors
bot.catch((err) => console.log('Error: ', err));

bot.launch();