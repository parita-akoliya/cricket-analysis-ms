const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const ReadFile = Util.promisify(Fs.readFile)

module.exports = class Invoice {
    async html(data) {
        try {
            const content = Fs.readFileSync(process.env.TEMPLATE_PATH, 'utf8');
            const template = Handlebars.compile(content)
            return template(data)
        } catch (error) {
            throw new Error('Cannot create invoice HTML template.' + JSON.stringify(error))
        }
    }
    async pdf(data) {
        const html = await this.html(data)
        const browser = await Puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium']
        })
        const page = await browser.newPage()
        await page.setContent(html)
        return page.pdf()
    }
}