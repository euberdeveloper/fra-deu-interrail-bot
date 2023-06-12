import './utils/moduleAlias';

import { Logger } from 'euberlog';
import * as minimist from 'minimist';

import { Scraper } from '@/utils/scraper';
import OPTIONS from '@/options';

const args = minimist(process.argv.slice(2));
const logger = new Logger({
    scope: 'alertText'
});

async function executeTask(): Promise<void> {
    try {
        logger.info('Starting...');
        const scraper = new Scraper(OPTIONS.websiteUrl);
        logger.info(await scraper.getAlertText());
    } catch (error: any) {
        logger.error(error);
    }
}

(async function () {
    try {
        if (args.help) {
            console.log(`
Usage: npm run scripts:alertText -- [--help]
Checks if the website is open.
If the parameter --help is passed, the help is printed.
            `);
        } else {
            await executeTask();
        }
    } catch (error: any) {
        logger.error(error);
    }
})();
