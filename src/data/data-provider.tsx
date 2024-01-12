import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react'
import { Cart, Product, Products } from '../types'
import { throws } from 'node:assert'

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
const productsURL = productsLink ?? '/data/kyiv.json'
const isJS = productsURL.endsWith('.js')

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
    const [products, setProducts] = useState<Products | null>(null)

    useEffect(() => {
        fetch(productsURL, { cache: 'no-store' })
            .then(response => response[isJS ? 'text' : 'json']())
            .then(data => {
                if (isJS) {
                    if (window.Worker) {
                        const worker = new Worker('/loader.js')
                        worker.postMessage(data)
                        worker.onmessage = (event) => {
                            if (Array.isArray(event.data)) {
                                setProducts(event.data)
                            } else {
                                setProducts([])
                            }
                        }
                    } else {
                        throw new Error( 'Web worker is not supported')
                    }
                    
                    return
                }
                
                setProducts(data)
            })
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
