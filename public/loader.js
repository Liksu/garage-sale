onmessage = function({ data: text }) {
    text = text.replace('export default', '').trim()
    const code = new Function('return ' + text)()

    postMessage(code)
}