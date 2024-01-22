import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Currency, Products } from '../types'
import { DataContext } from '../data/data-provider'
import { ConfigContext } from './config-provider'

export interface CurrencyProviderType {
    currency: Currency | null
    toggle: (currency?: Currency) => void
    loading?: boolean
}

export const CurrencyContext = createContext<CurrencyProviderType>({
    currency: null,
    toggle: () => {},
    loading: false
})

export const CurrencyProvider: FC<PropsWithChildren> = ({ children }) => {
    const { defaultCurrency } = useContext(ConfigContext)
    const [currencies, setCurrencies] = useState<Array<Currency>>([])
    const storedCurrency: Currency | null = localStorage.getItem('currency') || defaultCurrency || null
    const [currency, setCurrency] = useState<Currency | null>(storedCurrency)
    
    const { loading: dataLoading, products } = useContext(DataContext)
    const [currencyLoading, setCurrencyLoading] = useState(true)

    const recalculate = (products: Products) => {
        const currencies = products
            .map(product => product.price)
            .filter(price => typeof price === 'object')
            .reduce((acc, price) => {
                Object.keys(price).forEach(key => acc.add(key))
                return acc
            }, new Set<Currency>())
        
        if (!currencies.size) return
        setCurrencies(Array.from(currencies))
        if (!currency) setCurrency(Array.from(currencies)[0])
    }
    
    useEffect(() => {
        if (dataLoading || !products || !products.length) return
        recalculate(products)
        setCurrencyLoading(false)
    }, [dataLoading, products])
    
    const toggle = (newCurrency?: Currency) => {
        if (!newCurrency) {
            const index = currencies.findIndex(curr => curr === currency)
            newCurrency = currencies[index + 1] || currencies[0]
        }
        
        localStorage.setItem('currency', newCurrency ?? '')
        setCurrency(newCurrency)
    }

    return (
        <CurrencyContext.Provider value={{
            currency,
            toggle,
            loading: currencyLoading
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}
