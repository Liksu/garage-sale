import { ReactElement, useEffect } from 'react'
import LinkWithQuery from './link-with-query'
import { Button, Card, Image } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import ShortUrl from './short-url'
import { useLocalStorage } from '@mantine/hooks'

interface ExternalLinkProps {
    url: string
}

interface LinkData {
    'og:title'?: string
    'title'?: string
    'pageTitle'?: string
    'og:image'?: string
    'image'?: string
    'og:description'?: string
    'description'?: string
    'og:url'?: string
    'url'?: string
}

export default function ExternalLink({ url }: ExternalLinkProps): ReactElement {
    const [data, setData] = useLocalStorage<LinkData | null>({
        key: url,
        defaultValue: null,
    })

    useEffect(() => {
        if (data) return
        fetch('/api/link-preview?url=' + url)
            .then(response => response.json())
            .then(setData)
            .catch(console.error)
    }, [url, data])
    
    if (!url) return (<></>)
    
    // preview data
    if (data) {
        const title = data['og:title'] ?? data['title'] ?? data['pageTitle'] ?? null
        const image = data['og:image'] ?? data['image'] ?? null
        const description = data['og:description'] ?? data['description'] ?? null
        const link = data['og:url'] ?? data['url'] ?? null
        
        return (<>
            <Card>
                {image ? <Image src={image} alt={title ?? ''} style={{ maxWidth: '100%' }} /> : null}
                {title ? <h3>{title}</h3> : null}
                {description ? <p>{description}</p> : null}
                {link ? <a href={link} target="_blank" rel="noopener noreferrer">{link}</a> : null}
            </Card>
        </>)
    }
    
    return (<>
        <LinkWithQuery to={url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" rightSection={<IconExternalLink size={16} />}>
                <ShortUrl url={url} />
            </Button>
        </LinkWithQuery>
    </>)
}
