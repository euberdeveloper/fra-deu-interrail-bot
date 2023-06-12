# [fra-deu-interrail-bot](https://t.me/fra_deu_interrail_bot)
A telegram bot to receive a message when the website for the Interrail ticket for France and Germany is updated.

## Project purpose

Recently, there has been the possibility to have a [ticket for the public transport in both France and Germany](https://www.tagesschau.de/ausland/europa/bahnticket-jugendliche-freundschaftspass-deutschland-frankreich-100.html). Since the spots were limited, the website had been assaulted, so the pace was deactivated and activated many times. This bot was created to receive a message when the website was updated, so that it was possible to register for the ticket in time.

## How was it made

The bot has been developed by using **Typescript** and **Node.js**. It uses an html parser for node, **Cheerio**. **Redis** has been used as database, **Telegraf** as bot library and **Bull.js** as a scheduler. The deploy has been done with **Docker**. The code is also linted with **ESLint** and **Prettier**.

## How does it work

It is quite simple:
1. The **telegram bot** is started; it has the **/start**, **/stop**, **/help**, **/author** and **/version** commands.
2. A **scheduler** is started by using bull.js
3. Every time the scheduler fires, it **parses the alert written in the website**, **saves it on redis**, **checks if there are changes** and, if there are changes, **sends a telegram message** to all the registered users.
4. Every time a user **starts or stops** the bot, it is **added or removed** to the redis database, so that the bot knows to whom send the messages.

## How was it deployed

There is a **Dockerfile** that is used to create an **image** of the bot, that is automatically published on **DockerHub** through a **Github Action**.