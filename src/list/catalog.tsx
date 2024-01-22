import { ReactElement, useContext } from 'react'
import { DataContext } from '../data/data-provider'
import { Loader, Text } from '@mantine/core'
import List from './list'
import { TranslationContext } from '../helpers/translation-provider'

export default function Catalog(): ReactElement {
    const { products } = useContext(DataContext)
    const { t } = useContext(TranslationContext)

    if (!products) return <Loader />

    if (products.length === 0) {
        return <Text ta="center">{t('np products')}</Text>
    }

    return <List products={products} />
}
