import express from 'express'

import LinkPreviewHandler from './apis/link-preview.js'

const app = express()
const port = 4110

app.get('/api/link-preview/', LinkPreviewHandler)

app.listen(port, () => {
    console.log(`Link preview app listening at http://localhost:${port}`)
})