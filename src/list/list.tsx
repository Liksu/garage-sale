import { ReactElement, Fragment } from 'react'
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

    // available, sold, booked
    const titles = ['Доступно', 'Заброньовано', 'Продано']
    const sections = products
        .reduce((acc, product) => {
            acc[product.booked ? 1 : product.sold ? 2 : 0].push(product)
            return acc
        }, titles.map(() => [] as Products))
        .map((list, index) => ({ list, title: titles[index] }))
        .filter(section => section.list.length > 0)

    return (<>
        {sections.map((section, index) => (
            <Fragment key={section.title}>
                {index ? <Divider mt="xl" mb="lg" label={section.title} /> : null}

                <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 4, lg: 5 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing={{ base: 'md', sm: 'xl' }}
                >
                    {section.list.map(product => (
                        <Card key={product.id}>
                            <ListItem product={product} />
                        </Card>
                    ))}
                </SimpleGrid>
            </Fragment>
        ))}
    </>)
}
