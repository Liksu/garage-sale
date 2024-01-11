import { ReactElement, useContext } from 'react'
import { CartContext } from './cart-provider'
import { Blockquote, Button, CopyButton, Group, Loader, Space, Text, Title } from '@mantine/core'
import { DataContext } from '../data/data-provider'
import List from '../list/list'
import { IconCheck, IconCopy, IconShare } from '@tabler/icons-react'
import CopyWidget from '../helpers/copy-widget'
import { useHref } from 'react-router-dom'

export default function Cart(): ReactElement {
    const { products } = useContext(DataContext)
    const { byCart, sum } = useContext(CartContext)

    if (!products) return <Loader />

    const productsInCart = products.filter(byCart)

    if (productsInCart.length === 0) {
        return <Text ta="center">Нічого ще не додано до кошика</Text>
    }
    
    const productsList = () => {
        return productsInCart
            .map(product => `${product.name} (id:${product.id}) ${product.price.uah} грн.`)
            .join('\n')
            + `\n\nЗагальна сума: ${sum} грн.`
    }
    
    const link = () => {
        window.params.set('cart', productsInCart.map(product => product.id).join(','))
        return window.location.origin + window.location.pathname + '?' + window.params.toString()
    }
    
    return (<>
        <Blockquote color="green" icon={<IconShare />} iconSize={32}>
            <Title order={4} mb="md">Поширити</Title>
            
            <Text>Для того, щоб надіслати запит на бронювання – скопіюйте обрані товари, та надішліть нам на пошту або у мессенджер.</Text>
            <Text>Також, є можливість поділитись обраними товарами за допомогою посилання.</Text>
            <Space h="md" />
            <Group>
                <CopyWidget value={productsList} text="Скопіювати текст" />
                <CopyWidget value={link} text="Скопіювати посилання" icon={<IconShare />} />
            </Group>
        </Blockquote>
        <Space h="xl" />
        <Title order={3} ta="center">Обрані товари:</Title>
        <Space h="md" />
        <List products={productsInCart} />
    </>)
}
