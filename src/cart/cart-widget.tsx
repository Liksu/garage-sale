import { ReactElement, useContext } from 'react'
import { Group, Indicator, Title } from '@mantine/core'
import { IconShoppingCart, IconShoppingCartSearch } from '@tabler/icons-react'
import { CartContext } from './cart-provider'
import Price from '../helpers/price'
import useNavigateWithQuery from '../helpers/use-navigate-with-query'

export default function CartWidget(): ReactElement {
    const { sum, onlyCartView, cart } = useContext(CartContext)
    const navigate = useNavigateWithQuery()

    const showCart = () => {
        navigate(`/cart`)
    }
    
    const icon = onlyCartView
        ? <IconShoppingCartSearch />
        : <IconShoppingCart />

    return (
        <Group onClick={showCart} style={{ cursor: 'pointer' }}>
            {cart.length
                ? <Indicator inline label={cart.length} size={16}>{icon}</Indicator>
                : icon
            }
            <Title order={3} c={onlyCartView ? 'green' : 'navy'}>
                <Price sum={sum} />
            </Title>
        </Group>
    )
}
