import { ReactElement } from 'react'
import { Product } from '../types'
import { Badge, Card, Group, Text, Title } from '@mantine/core'
import Price from '../helpers/price'
import CartButton from '../cart/cart-button'
import Photo from '../helpers/photo'
import useNavigateWithQuery from '../helpers/use-navigate-with-query'

interface ListItemProps {
    product: Product
}

export default function ListItem({ product }: ListItemProps): ReactElement {
    const navigate = useNavigateWithQuery()

    const goToProduct = () => {
        navigate(`/${product.id}`)
    }
    
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder onClick={goToProduct} style={{ cursor: 'pointer' }}>
            <Card.Section>
                <Photo product={product} style={product.sold ? { opacity: 0.5 } : {}} />
            </Card.Section>

            <Title order={4} my="md" c={product.sold ? 'gray.3' : 'black'}>{product.name}</Title>

            {product.shortDescription
                ? <Text size="sm" c="dimmed">{product.shortDescription}</Text>
                : null}

            <Group justify="space-between">
                <Title order={3} fw={400} c="red"><Price sum={product.price} /></Title>
                {product.booked
                    ? <Badge color="yellow" variant="light" size="sm">Заброньовано</Badge>
                    : null}
                <CartButton product={product} />
            </Group>
        </Card>
    )
}
