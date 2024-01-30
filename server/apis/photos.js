const key = ''
const folderId = '1-vGbQ4Gt6XU6D40DevpcQDKAl_fsX91n'

export default async function handler(req, res) {
    return res.status(404).json({ message: 'API disabled' })
    
    const url = `https://www.googleapis.com/drive/v2/files?q='${folderId}'+in+parents&key=${key}`
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
}
