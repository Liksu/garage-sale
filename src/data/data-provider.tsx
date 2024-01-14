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
const productsURL = productsLink ?? 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHMD4_md7j2ilBSLg_qrAl3lo3IYXWWCSYtDZvaTEV7FfBwBu2D7f-B-dk31-kvFV_lXvs98dHpc7e/pub?gid=1077703447&single=true&output=tsv'
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
