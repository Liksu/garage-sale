import { ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { DataContext } from '../data/data-provider'
import { Badge, Group, Space, Spoiler, Stack, Title, Text, useMantineTheme } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Photo, { composePhotoURL } from '../helpers/photo'
import { useHotkeys, useMediaQuery } from '@mantine/hooks'
import classes from './product-page.module.css'
import Price from '../helpers/price'
import CartButton from '../cart/cart-button'
import NavigateWithQuery from '../helpers/navigate-with-query'
import { TranslationContext } from '../helpers/translation-provider'
import ExternalLink from '../helpers/external-link'
import { Helmet } from 'react-helmet'

export default function ProductPage(): ReactElement {
    const params = useParams()
    const theme = useMantineTheme()
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    const { getProductById } = useContext(DataContext)
    const { t, ta } = useContext(TranslationContext)
    useHotkeys([
        ['ArrowLeft', event => document.querySelectorAll<HTMLButtonElement>('.mantine-Carousel-control')[0]?.click()],
        ['ArrowRight', event => document.querySelectorAll<HTMLButtonElement>('.mantine-Carousel-control')[1]?.click()]
    ])

    if (!params.productId) {
        return <NavigateWithQuery to={'/'} />
    }

    const product = getProductById(params.productId)
    if (!product) {
        return <NavigateWithQuery to={'/'} />
    }

    const slides = product.images?.map(image => (
        <Carousel.Slide key={image}>
            <Photo product={product} image={image} height={400} expandable />
        </Carousel.Slide>
    )) ?? []

    const ogDescription = product.shortDescription ?? product.description
    const ogImage = composePhotoURL(product)
    
    return (<>
        <Helmet>
            <meta property="og:title" content={product.name} />
            {ogDescription ? <meta property="og:description" content={ogDescription} /> : null}
            {ogImage ? <meta property="og:image" content={ogImage} /> : null }
            <meta property="og:url" content={window.location.href} />
        </Helmet>
        <Stack gap="sm">
            <Title order={2}>{product.name}</Title>
            {product.sold
                ? <Badge color="red" variant="light" size="xl">{t('sold')}</Badge>
                :
                product.booked
                    ? <Badge color="yellow" variant="light" size="xl">{t('booked')}</Badge>
                    : null}
            <Space h="md" />

            {slides.length ? <Carousel
                classNames={classes}
                slideSize="100%"
                height={400}
                slideGap="sm"
                py="xs"
                withIndicators
            >
                {slides}
            </Carousel> : null}

            <Space h="md" />

            <Group>
                <Title order={2} fw={400} c="red"><Price sum={product.price} /></Title>
                <CartButton product={product} text={ta('I want this')} />
            </Group>

            <Spoiler maxHeight={mobile ? 120 : 300} showLabel={t('show more')} hideLabel={t('hide')}
                     transitionDuration={0}>
                {product.description?.split(/ +\//).map((text, i) => <Text key={i}>{text}</Text>)}
            </Spoiler>

            <Space h="md" />
            <Group gap="md">
                {product.urls?.map(url => (
                    <ExternalLink url={url} key={url} />
                )) ?? null}
            </Group>
        </Stack>
    </>)
}
