[![Bot API Version](https://img.shields.io/badge/Bot%20API-v4.8-f36caf.svg?style=flat-square)](https://core.telegram.org/bots/api)
[![NPM Version](https://img.shields.io/npm/v/telegraf.svg?style=flat-square)](https://www.npmjs.com/)
[![node](https://img.shields.io/node/v/telegraf.svg?style=flat-square)](https://www.npmjs.com/package/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# [BMonitoring Bot](https://github.com/bostrot/telegram-support-bot)
is a Monitoring and support bot for telegram bots, using the Telegraf framework (by [@Manusii](https://github.com/RaunaTanpa)).
1. It's a bot that monitors all the bots (investors, games, invitebot, etc.) by realtime
2. It lets users create tickets which will be send to a staff group and can be answered by a reply.

## Documentation

`telegram-support-bot` was built on top of [`Telegraf`](https://github.com/telegraf/telegraf) libary.

[Telegraf documentation](http://telegraf.js.org).

## Installation

Install Node ( > 8 ) and npm ( > 3.38.0 ).

Run it
```bash
git clone https://github.com/RaunaTanpa/BMonitoringBot.git
cd BMonitoringBot
npm i
cp config/config-sample.ts config/config.ts     # Adjust settings in config.ts
npm run prod                                    # For debugging: npm run dev
```

## Configuration

You can get your ID with /id. The first number will be yours the second the one from the group you are in (if you are in one; including the minus).

You need to set your bot token and chat ids in `config.ts`:

```js
    // bot settings
   bot_token: 'YOUR_BOT_TOKEN', // support bot token
   staffchat_id: 'SUPERGROUP_CHAT_ID', // eg. -123456789
   owner_id: 'YOUR_TELEGRAM_ID', //your telegram chat id here, allows usage of /broadcast command
   adminChatId: 12345678,       //your telegram chat id here, allows usage of /broadcast command
   spam_time: 5 * 60 * 1000, // time (in MS) in which user may send 5 messages
   allow_private: false, // Allow / disallow option for staff to chat privately
   auto_close_tickets: true,
```

## Features

When a user sends a message to the support chat it will create a ticket which will be forwarded to the staff group. Any admin in the staff group may answer that ticket by just replying to it. Salutation is added automatically. Photos will be forwared too.

Currently the support chat offers these commands (staff commands):
* `/open` - lists all open tickets (messages where noone has replied yet)
* `/close` - close a ticket manually (in case someone writes 'thank you')
* `/id` - returns your telegram id and the group chat id (1234567 -1234567890)
* `/ban` - ban a person from writing to your chat

User commands:
* `/start` - tells the user how to use this bot
* `/help` - an overview over the commands or some explanation for the user
* `/faq` - shows the FAQ

Features:
* File forwarding from and to user
* Database for handling open and closed tickets
* Restrict users
* Simple anti spam system
* Send tickets to different staff groups
* Private reply to user

## Docker

via docker-compose:
```
docker-compose up -d
```

or build:

```
docker build -t RaunaTanpa/BMonitoringBot:latest .
docker run RaunaTanpa/BMonitoringBot -v /path/to/config_dir:/bot/config
```

## Update to v1.0.1

Backup and delete the database file (src/support.db) and move config.js to folder config. Then just start it normally.

## Telegram token

To use the [Telegram Bot API](https://core.telegram.org/bots/api), 
you first have to [get a bot account](https://core.telegram.org/bots) 
by [chatting with BotFather](https://core.telegram.org/bots#6-botfather).

BotFather will give you a *token*, something like `123456789:AbCdfGhIJKlmNoQQRsTUVwxyZ`.

## Creating a bot

[Telegraf bot framework](https://github.com/telegraf/telegraf) for building a bot
