import { MouseEventHandler, ReactElement, useContext, useEffect } from 'react'
import { Product } from '../types'
import { ActionIcon, Button } from '@mantine/core'
import { IconShoppingCart, IconShoppingCartCopy } from '@tabler/icons-react'
import { CartContext } from './cart-provider'
import { useLocation, useSearchParams } from 'react-router-dom'

interface CartButtonProps {
    product: Product
    text?: string | Array<string>
}

export default function CartButton({ product, text }: CartButtonProps): ReactElement {
    const { addToCart, checkCart, removeFromCart, cart } = useContext(CartContext)
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [addText, removeText] = text ? (Array.isArray(text) ? text : [text, text]) : [null, null]

    useEffect(() => {
        if (searchParams.get('cart')) {
            searchParams.set('cart', cart.join(','))
            setSearchParams(() => searchParams)
        }
    }, [cart])

    if (product.sold) return (<></>)

    const eventHandler: MouseEventHandler = event => {
        event.stopPropagation()
        event.preventDefault()
    }

    const remove: MouseEventHandler<HTMLButtonElement> = event => {
        removeFromCart(product.id)
        eventHandler(event)
    }

    const add: MouseEventHandler<HTMLButtonElement> = event => {
        addToCart(product.id)
        eventHandler(event)
    }

    if (checkCart(product.id)) {
        const removeIcon = (
            <ActionIcon variant="filled" color="green" size="lg" radius="xl" onClick={remove}>
                <IconShoppingCartCopy style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
        )
        
        if (removeText) return (<>
            <Button
                variant="subtle"
                color="red.3"
                size="md"
                radius="xl"
                onClick={remove}
                leftSection={removeIcon}
            >
                {removeText}
            </Button>
        </>)
        
        return removeIcon
    }

    const addIcon = (
        <ActionIcon variant="filled" color="blue" size="lg" radius="xl" onClick={add}>
            <IconShoppingCart style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
    )
    
    if (addText) return (<>
        <Button
            variant="subtle"
            color="blue"
            size="md"
            radius="xl"
            onClick={add}
            leftSection={addIcon}
        >
            {addText}
        </Button>
    </>)
    
    return addIcon
}
