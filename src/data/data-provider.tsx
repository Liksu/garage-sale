import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react'
import { Cart, Product, Products } from '../types'

export interface DataProviderType {
    products: Products | null
    getProductById: (id: string) => Product | null
    filterProducts: (filter: string) => Products | null
    showSelected: (ids: Cart) => Products
}

export const DataContext = createContext<DataProviderType>({
    products: null,
    getProductById: (id: string) => null,
    filterProducts: (filter: string) => null,
    showSelected: (ids: Cart) => []
})

const productsLink = window.params.get('products')
const productsURL = productsLink ?? '/data/products.json'

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
    const [products, setProducts] = useState<Products | null>(null)

    useEffect(() => {
        fetch(productsURL, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])

    const getProductById = (id: string): Product | null => {
        return products?.find(product => product.id === id) || null
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
            showSelected
        }}>
            {children}
        </DataContext.Provider>
    )
}
