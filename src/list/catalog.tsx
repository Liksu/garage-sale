import { ReactElement, useContext } from 'react'
import { DataContext } from '../data/data-provider'
import { Loader, Text } from '@mantine/core'
import List from './list'

export default function Catalog(): ReactElement {
    const { products } = useContext(DataContext)

    if (!products) return <Loader />

    if (products.length === 0) {
        return <Text ta="center">Товари відсутні</Text>
    }

    return <List products={products} />
}
