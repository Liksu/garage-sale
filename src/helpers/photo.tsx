import { ReactElement } from 'react'
import { Product } from '../types'
import { em, Image, Modal } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

interface PhotoProps {
    product: Product
    image?: string
    fit?: 'contain' | 'cover'
    height?: number
    expandable?: boolean
    [key: string]: any
}

export default function Photo({ product, image, fit = 'contain', height, style = {}, expandable, ...rest }: PhotoProps): ReactElement {
    const [opened, { close, open }] = useDisclosure(false)
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
    
    image ??= product.images?.[0]
    if (!image) return (<></>)
    const url = image.startsWith('http') ? image : `/data/photos/${product.id}/${image}`
    
    return (<>
        <Modal opened={opened} onClose={close} centered withCloseButton={false} size="100%">
            <Image
                src={url}
                referrerPolicy="unsafe-url"
                fallbackSrc="/no-photo.png"
                alt={product.name}
                style={style}
                onClick={close}
                {...rest}
            />
        </Modal>

        <Image
            src={url}
            referrerPolicy="unsafe-url"
            fallbackSrc="/no-photo.png"
            alt={product.name}
            height={height ?? 200}
            style={{ objectFit: fit, ...style }}
            onClick={expandable && !isMobile ? open : undefined}
            {...rest}
        />
    </>)
}
