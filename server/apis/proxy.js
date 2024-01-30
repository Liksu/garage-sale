export default async function handler(req, res) {
    const url = req.query.url
    if (!url) {
        return res.status(400).send('Missing url')
    }
    
    try {
        const response = await fetch(url, { cache: 'no-cache' })
        const text = await response.text()
        res.status(response.status).send(text)
    } catch (e) {
        res.status(500).send('Error: ' + (e.message ?? ''))
    }
}
