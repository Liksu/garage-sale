import { ReactElement } from 'react'

interface ShortUrlProps {
    url: string
}

export default function ShortUrl({ url }: ShortUrlProps): ReactElement {
    const segments = url.replace(/^https?:\/\//, '').split('/').filter(Boolean)
    const domain = segments.shift()
    const last = segments.pop()
    const short = `${domain}/.../${last}`
    
    return (<>
        {short}
    </>)
}
