/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Telegraf } from 'telegraf';
import { Logger } from 'euberlog';

import { Database } from '@/utils/database';
import options from '@/options';

const logger = new Logger('bot');

export class Bot {
    private readonly bot: Telegraf;
    private readonly database: Database;

    constructor(botToken: string, database: Database) {
        this.database = database;
        this.bot = new Telegraf(botToken);
        this.init();
    }

    private init(): void {
        const welcomeText = `Welcome, I am the bot that will notify you if deu fra is open!`;
        const commandsText = `
Commands:
● <b>/start</b> will register you to the newsletter
● <b>/stop</b> will unregister you from the newsletter
● <b>/author</b> will show you information about the author and the source code
● <b>/version</b> will show you the bot version
● <b>/help</b> will show you this message again
        `;

        const helpText = `${welcomeText}
        
${commandsText}`;
        const startText = `${welcomeText}

You have just been registered to the newsletter.

${commandsText}`;

        this.bot.start(async ctx => {
            logger.debug('Start command', ctx.chat);
            await this.database.pushChat(ctx.chat.id);
            return ctx.reply(startText, { parse_mode: 'HTML' });
        });
        this.bot.command('stop', async ctx => {
            logger.debug('Stop command', ctx.chat);
            await this.database.removeChat(ctx.chat.id);
            return ctx.reply(
                'You have been deregistered. If you want to start receiving notifications again, use the <b>/start</b> command',
                { parse_mode: 'HTML' }
            );
        });
        this.bot.command('author', async ctx => {
            logger.debug('Author command', ctx.chat);
            return ctx.reply(
                'The author of this bot is <i>Eugenio Berretta</i>, the bot is open source and visible at <i>https://github.com/euberdeveloper/frankreich-deutschland-interrail-bot</i>.',
                { parse_mode: 'HTML' }
            );
        });
        this.bot.command('version', async ctx => {
            logger.debug('Version command', ctx.chat);
            return ctx.reply(`The version of this bot is <b>${options.version}</b>`, { parse_mode: 'HTML' });
        });
        this.bot.command('backup', async ctx => {
            logger.debug('Backup command', ctx.chat);
            const chatContext: any = ctx.chat;
            if (this.checkItsMe(chatContext.username)) {
                const chats = await this.database.getChats();
                const formattedTimestamp = new Date().toISOString().replaceAll(':', '_');
                return ctx.replyWithDocument({
                    source: Buffer.from(JSON.stringify(chats)),
                    filename: `chats_${formattedTimestamp}.json`
                });
            }
        });
        this.bot.help(async ctx => {
            logger.debug('Help command', ctx.chat);
            return ctx.reply(helpText, { parse_mode: 'HTML' });
        });
        void this.bot.launch();
    }

    private checkItsMe(chatUsername: string): boolean {
        return chatUsername === options.telegram.adminUsername;
    }

    public async sendMessageToChat(message: string, chatId: number): Promise<void> {
        try {
            await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (error) {
            logger.error(`Error sending message to chat ${chatId}`, error);
        }
    }

    public async sendMessageToEveryone(message: string): Promise<void> {
        const chattIds = await this.database.getChats();
        const tasks = chattIds.map(async chatId => this.sendMessageToChat(message, chatId));
        await Promise.all(tasks);
    }

    public async sendNotificationMessage(alertMessage: string): Promise<void> {
        const message = `Something changed: the new alert message is <b>${alertMessage}</b>`;
        await this.sendMessageToEveryone(message);
    }

    public close(): void {
        this.bot.stop();
    }
}
