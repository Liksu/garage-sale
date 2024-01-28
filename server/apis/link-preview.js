import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
})

const cache = new Map()

export default async function handler(req, res) {
    if (!req.query.url) {
        return res.status(400).send('Missing url')
    }

    if (cache.has(req.query.url)) {
        return res.json(cache.get(req.query.url))
    }
    
    let data = null
    try {
        data = await getPreview(req.query.url)
        res.json(data)
    } catch (e) {
        res.status(500).send('Error: ' + (e.message ?? ''))
    }

    cache.set(req.query.url, data)
}

async function getPreview(url) {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36')
    await page.goto(url)
    
    const metas = await page.evaluate(() => {
        const tags = document.getElementsByTagName('meta')
        const pairs = Array.from(tags, tag => [tag.getAttribute('property') || tag.name, tag.content]).filter(item => item[0])
        const data = Object.fromEntries(pairs)
        data.pageTitle ||= document.querySelector('title')?.innerText ?? null
        return data
    })
    metas.url ||= url
    
    await page.close()
    return metas
}
