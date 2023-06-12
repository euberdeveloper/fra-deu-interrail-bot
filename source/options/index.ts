import * as dotenv from 'dotenv';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const packageJson = require(path.join(process.cwd(), 'package.json'));

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

const redisHost = process.env.REDIS_HOST ?? 'localhost';
const redisPort = process.env.REDIS_PORT ?? 6379;

export default {
    websiteUrl: process.env.WEBSITE_URL ?? 'https://anmelden.deutsch-franzoesischer-interrail-pass.de/',
    divSelector: process.env.DIV_SELECTOR ?? 'div.font-bold.text-grey-medium',
    redis: {
        host: redisHost,
        port: redisPort,
        url: `redis://${redisHost}:${redisPort}`
    },
    scrapingCron: process.env.SCRAPING_CRON ?? '* * * * *',
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN as string,
        adminUsername: process.env.TELEGRAM_ADMIN_USERNAME as string
    },
    version: packageJson.version as string
};
