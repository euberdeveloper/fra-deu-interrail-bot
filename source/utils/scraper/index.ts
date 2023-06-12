import logger from 'euberlog';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OPTIONS from '@/options';

export class Scraper {
    private readonly websiteUrl: string;

    constructor(websiteUrl: string) {
        this.websiteUrl = websiteUrl;
    }

    public async getAlertText(): Promise<string> {
        const response = await axios(this.websiteUrl, { responseType: 'text' });
        const body = response.data;
        const dom = cheerio.load(body);
        const text = dom(OPTIONS.divSelector).text().trim();
        return text;
    }

    public async isOpen(): Promise<boolean> {
        try {
            const text = await this.getAlertText();
            return !text.includes('ist Opfer seines Erfolgs geworden');
        } catch (error) {
            logger.error('Error in fetching website html', error);
        }
        return false;
    }
}
