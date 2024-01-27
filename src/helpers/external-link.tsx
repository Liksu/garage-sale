import { ReactElement, useEffect, memo } from 'react'
import LinkWithQuery from './link-with-query'
import { Button, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
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

export default memo(function ExternalLink({ url }: ExternalLinkProps): ReactElement {
    const [data, setData] = useLocalStorage<LinkData | false | null>({
        key: url?.replace(/\W/gi, '_') ?? 'external-link',
        defaultValue: null,
        getInitialValueInEffect: false
    })

    useEffect(() => {
        if (data != null) return
        fetch('/api/link-preview?url=' + url)
            .then(response => response.json())
            .then(setData)
            .catch(error => {
                console.error(error)
                setData(false)
            })
    }, [url, data])

    if (!url) return (<></>)

    // preview data
    if (data) {
        const title = data['og:title'] ?? data['title'] ?? data['pageTitle'] ?? null
        const image = data['og:image'] ?? data['image'] ?? null
        const description = data['og:description'] ?? data['description'] ?? null
        const link = data['og:url'] ?? data['url'] ?? url

        return (
            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Paper withBorder radius="md" style={{ maxWidth: '360px' }} p="sm">
                    <Group wrap="nowrap">
                        <Stack gap="xs">
                            {title ? <Title order={5}><IconExternalLink size={16} /> {title}</Title> : null}
                            {description ? <Text size="xs">{description}</Text> : null}
                        </Stack>
                        {image ? <Image src={image} alt={title ?? ''} maw="96px" mah="96px" /> : null}
                    </Group>
                </Paper>
            </a>
        )
    }

    return (<>
        <LinkWithQuery to={url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" rightSection={<IconExternalLink size={16} />}>
                <ShortUrl url={url} />
            </Button>
        </LinkWithQuery>
    </>)
})
