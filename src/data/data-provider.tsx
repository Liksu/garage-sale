import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Cart, Config, Currency, Product, Products } from '../types'
import { useLoader } from '../helpers/use-loader'
import { ConfigContext } from '../helpers/config-provider'

export interface DataProviderType {
    products: Products | null
    getProductById: (id: string, available?: boolean) => Product | null
    filterProducts: (filter: string) => Products | null
    showSelected: (ids: Cart) => Products
    getPrice: (id: string, currency?: Currency | null) => number
    loading?: boolean
}

export const DataContext = createContext<DataProviderType>({
    products: null,
    getProductById: () => null,
    filterProducts: () => null,
    showSelected: () => [],
    getPrice: () => 0,
    loading: false
})

const defaultProductsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHMD4_md7j2ilBSLg_qrAl3lo3IYXWWCSYtDZvaTEV7FfBwBu2D7f-B-dk31-kvFV_lXvs98dHpc7e/pub?gid=1077703447&single=true&output=tsv'

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
    const [products, setProducts] = useState<Products | null>(null)
    const [loading, loadProducts] = useLoader<Products>({
        param: 'products',
        defaultURL: defaultProductsURL,
        defaultValue: []
    })
    
    useEffect(() => {
        loadProducts()
            .then(setProducts)
            .catch(console.error)
    }, [])

    const getProductById = (id: string, available = false): Product | null => {
        if (!products) return null
        return products.find(product => product.id === id && (!available || !product.sold)) || null
    }

    const getPrice = (id: string, currency?: Currency | null): number => {
        const product = getProductById(id)
        if (!product?.price) return 0

        if (typeof product.price === 'number') return product.price
        if (!currency) return 0

        return product.price[currency] ?? 0
    }

    const filterProducts = (filter: string): Products | null => {
        return products?.filter(product => product.name.toLowerCase().includes(filter.toLowerCase())) || null
    }
    
    const showSelected = (ids: Cart): Products => {
        return products?.filter(product => ids.includes(product.id)) || []
    }
    
    // @ts-ignore
    window.products = products

    return (
        <DataContext.Provider value={{
            products,
            getProductById,
            filterProducts,
            showSelected,
            getPrice,
            loading
        }}>
            {children}
        </DataContext.Provider>
    )
}
