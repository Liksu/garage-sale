import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
    args: [
        `--window-size=800,600`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disable-gpu-shader-disk-cache',
        '--media-cache-size=0',
        '--disk-cache-size=0',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--mute-audio',
        '--no-default-browser-check',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-notifications',
        '--disable-background-networking',
        '--disable-breakpad',
        '--disable-component-update',
        '--disable-domain-reliability',
        '--disable-sync',
    ]
})

const cache = new Map()

export default async function handler(req, res) {
    if (!req.query.url) {
        return res.status(400).send('Missing url')
    }

    if (req.query.flush != null && req.query.flush !== '' && cache.has(req.query.url)) {
        cache.delete(req.query.url)
    }
    
    if (req.query.remove != null && req.query.remove !== '' && cache.has(req.query.url)) {
        cache.delete(req.query.url)
        return res.status(200).send('Removed')
    }
    
    if (cache.has(req.query.url)) {
        return res.json(cache.get(req.query.url))
    }
    
    let data = null
    try {
        data = await getPreview(req.query.url)
        
        if (data.pageTitle === 'Just a moment...') {
            return res.status(503).send('Cloudflare protection')
        }
        
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

    await new Promise(resolve => setTimeout(resolve, 1000))

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
