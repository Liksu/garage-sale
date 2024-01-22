import { ReactElement, useContext } from 'react'
import { CartContext } from './cart-provider'
import { Blockquote, Group, Loader, Space, Text, Title } from '@mantine/core'
import { DataContext } from '../data/data-provider'
import List from '../list/list'
import { IconShare } from '@tabler/icons-react'
import CopyWidget from '../helpers/copy-widget'
import { TranslationContext } from '../helpers/translation-provider'
import { CurrencyContext } from '../helpers/currency-provider'
import { price } from '../helpers/price'

export default function Cart(): ReactElement {
    const { products } = useContext(DataContext)
    const { byCart, sum } = useContext(CartContext)
    const { t, ta } = useContext(TranslationContext)
    const { currency } = useContext(CurrencyContext)

    if (!products) return <Loader />

    const productsInCart = products.filter(byCart)

    if (productsInCart.length === 0) {
        return <Text ta="center">{t('empty cart')}</Text>
    }

    const productsList = () => {
        return productsInCart
                .map(product => `${product.name} (id:${product.id}) ${price(product.price.uah, currency, false)}.`)
                .join('\n')
            + `\n\n${t('total')} ${price(sum, currency, false)}.`
    }

    const link = () => {
        window.params.set('cart', productsInCart.map(product => product.id).join(','))
        return window.location.origin + window.location.pathname + '?' + window.params.toString()
    }

    return (<>
        <Blockquote color="green" icon={<IconShare />} iconSize={32}>
            <Title order={4} mb="md">{t('share cart')}</Title>
            {ta('share cart description').map((text, index) => <Text key={index}>{text}</Text>)}
            <Space h="md" />
            <Group>
                <CopyWidget value={productsList} text={t('copy text')} />
                <CopyWidget value={link} text={t('copy link')} icon={<IconShare />} />
            </Group>
        </Blockquote>
        <Space h="xl" />
        <Title order={3} ta="center">{t('selected products')}</Title>
        <Space h="md" />
        <List products={productsInCart} />
    </>)
}
