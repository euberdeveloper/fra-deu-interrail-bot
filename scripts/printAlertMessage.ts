import './utils/moduleAlias';

import { Logger } from 'euberlog';
import * as minimist from 'minimist';

import { Database } from '@/utils/database';
import OPTIONS from '@/options';

const args = minimist(process.argv.slice(2));
const logger = new Logger({
    scope: 'printAlertMessage',
    debug: args.debug === true
});

async function executeTask(): Promise<void> {
    let database: Database | null = null;

    try {
        logger.debug('Starting...');

        database = new Database({
            url: OPTIONS.redis.url
        });
        await database.open();
        logger.debug('Database instance created');

        const alertMessage = await database.getAlertMessage();
        logger.debug('The alert message is: ');

        console.log(alertMessage ?? 'null');
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
Usage: npm run scripts:print-alert-message -- [--debug] [--help]
Prints the current alert message in the database.
If the parameter --help is passed, the help is printed.
If the parameter --debug is passed, there will also be a debug log.
If the parameter --pretty is passed, the output will be pretty printed (a number specifies the indentation, which is 2 by default).
            `);
        } else {
            await executeTask();
        }
    } catch (error: any) {
        logger.error(error);
    }
})();
