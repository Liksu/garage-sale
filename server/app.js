import express from 'express'

import LinkPreviewHandler from './apis/link-preview.js'
import PhotosListHandler from './apis/photos.js'

const app = express()
const port = 4110

const allowedOrigins = [
    new RegExp('^https://sale\\.liksu\\.com/', 'i'),
    new RegExp('^http://localhost(:\\d+)?/', 'i'),
    new RegExp('^http://127\\.0\\.0\\.1(:\\d+)?/', 'i'),
]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    const isAllowed = req.headers.referer && allowedOrigins.some(origin => origin.test(req.headers.referer))
    if (!isAllowed) {
        return res.status(404).send('Not Found')
    }
    next()
})

app.get('/api/link-preview/', LinkPreviewHandler)
// app.get('/api/photos/', PhotosListHandler)

app.listen(port, () => {
    console.log(`Link preview app listening at http://localhost:${port}`)
})