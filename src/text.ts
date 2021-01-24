import * as db from './db';
import config from '../config/config';
import * as staff from './staff';
import * as users from './users';

/**
 * Text handler
 * @param {Object} bot
 * @param {Object} ctx
 * @param {Array} keys
 */
function handleText(bot, ctx, keys) {
  if (ctx.session.mode == 'private_reply') {
    staff.privateReply(bot, ctx);
  } else if (config.categories.length > 0 && !(JSON.stringify(config.categories)
      .indexOf(ctx.message.text) > -1)) {
    if (!ctx.session.admin && config.categories &&
    !ctx.session.group) {
      ctx.reply(config.language.services, {
        reply_markup: {
          keyboard: keys,
        },
      });
    } else {
      ticketHandler(bot, ctx);
    }
  } else {
    ticketHandler(bot, ctx);
  }
};

/**
* Decide whether to forward or stop the message.
* @param {bot} bot Bot object.
* @param {context} ctx Bot context.
*/
function ticketHandler(bot, ctx) {
  if (ctx.chat.type === 'private') {
    db.getOpen(ctx.message.from.id, ctx.session.groupCategory, function(ticket) {
      if (ticket == undefined) {
        console.log(ctx.session.groupCategory)
        db.add(ctx.message.from.id, 'open', ctx.session.groupCategory);
      }
      users.chat(ctx, bot, ctx.message.chat);
    });
  } else {
    staff.chat(ctx, bot);
  }
}

export {
  handleText,
  ticketHandler,
};