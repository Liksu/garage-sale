import { ReactElement } from 'react'
import { Product } from '../types'
import { Image } from '@mantine/core'

interface PhotoProps {
    product: Product
    image?: string
    fit?: 'contain' | 'cover'
    height?: number
    [key: string]: any
}

export default function Photo({ product, image, fit = 'contain', height, style = {}, ...rest }: PhotoProps): ReactElement {
    image ??= product.images?.[0]
    if (!image) return (<></>)
    const url = image.startsWith('http') ? image : `/data/photos/${product.id}/${image}`
    return <Image
        src={url}
        fallbackSrc="/no-photo.png"
        alt={product.name}
        height={height ?? 200}
        style={{ objectFit: fit, ...style }}
        {...rest}
    />
}
