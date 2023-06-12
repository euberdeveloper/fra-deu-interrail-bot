import './utils/moduleAlias';

import { Logger } from 'euberlog';
import * as minimist from 'minimist';

import { Database } from '@/utils/database';
import OPTIONS from '@/options';

const args = minimist(process.argv.slice(2));
const logger = new Logger({
    scope: 'setAlertMessage'
});

async function executeTask(message: string): Promise<void> {
    let database: Database | null = null;

    try {
        logger.info('Starting...');

        database = new Database({
            url: OPTIONS.redis.url
        });
        await database.open();
        logger.debug('Database instance created');

        await database.setAlertMessage(message);
        logger.success('The alert message has been set in the database');
    } catch (error: any) {
        logger.error(error);
    } finally {
        if (database !== null) {
            await database.close();
        }
    }
}

(async function () {
    try {
        if (args.help) {
            console.log(`
Usage: npm run scripts:set-alert-message -- [--help] [--message <string>]
Sets the alert message in the database.
If the parameter --help is passed, the help is printed.
The parameter --message is required and consists in the alert message that will be saved in the database.
            `);
        } else {
            const message: string | undefined = args.message;
            if (!message) {
                throw new Error(
                    'The message is missing. Please pass the --message parameter. Pass --help for more information.'
                );
            }
            await executeTask(message);
        }
    } catch (error: any) {
        logger.error(error);
    }
})();
