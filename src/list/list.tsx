import { ReactElement } from 'react'
import { Card, Divider, Loader, SimpleGrid, Text } from '@mantine/core'
import ListItem from './list-item'
import { Products } from '../types'

export interface ListProps {
    products: Products | null
}

export default function List({ products }: ListProps): ReactElement {
    if (!products) return <Loader />

    if (products.length === 0) {
        return <Text ta="center">Нічого немає</Text>
    }

    return (<>
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 4, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            {products.filter(product => !product.sold).map(product => (
                <Card key={product.id}>
                    <ListItem product={product} />
                </Card>
            ))}
        </SimpleGrid>

        <Divider mt="xl" mb="lg" label="Продано" />

        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 4, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            {products.filter(product => product.sold).map(product => (
                <Card key={product.id}>
                    <ListItem product={product} />
                </Card>
            ))}
        </SimpleGrid>
    </>)
}
