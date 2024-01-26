import { ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { DataContext } from '../data/data-provider'
import { Badge, Group, Space, Spoiler, Stack, Title, useMantineTheme } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Photo from '../helpers/photo'
import { useMediaQuery } from '@mantine/hooks'
import classes from './product-page.module.css'
import Price from '../helpers/price'
import CartButton from '../cart/cart-button'
import NavigateWithQuery from '../helpers/navigate-with-query'
import { TranslationContext } from '../helpers/translation-provider'
import ExternalLink from '../helpers/external-link'

export default function ProductPage(): ReactElement {
    const params = useParams()
    const theme = useMantineTheme()
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    const { getProductById } = useContext(DataContext)
    const { t } = useContext(TranslationContext)

    if (!params.productId) {
        return <NavigateWithQuery to={'/'} />
    }

    const product = getProductById(params.productId)
    if (!product) {
        return <NavigateWithQuery to={'/'} />
    }

    const slides = product.images.map(image => (
        <Carousel.Slide key={image}>
            <Photo product={product} image={image} height={400} />
        </Carousel.Slide>
    ))

    return (<Stack gap="sm">
        <Title order={2}>{product.name}</Title>
        {product.sold
            ? <Badge color="red" variant="light" size="xl">{t('sold')}</Badge>
            :
            product.booked
                ? <Badge color="yellow" variant="light" size="xl">{t('booked')}</Badge>
                : null}
        <Space h="md" />

        <Carousel
            classNames={classes}
            slideSize="100%"
            height={400}
            slideGap="sm"
            py="xs"
            withIndicators
        >
            {slides}
        </Carousel>

        <Space h="md" />

        <Group>
            <Title order={2} fw={400} c="red"><Price sum={product.price} /></Title>
            <CartButton product={product} />
        </Group>

        <Spoiler maxHeight={mobile ? 120 : 300} showLabel={t('show more')} hideLabel={t('hide')} transitionDuration={0}>
            {product.description}
        </Spoiler>

        <Space h="md" />
        <Group gap="md">
            {product.urls?.map(url => (
                <ExternalLink url={url} key={url} />
            )) ?? null}
        </Group>
    </Stack>)
}
