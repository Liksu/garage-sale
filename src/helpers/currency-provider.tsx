import { createContext, FC, PropsWithChildren, useState } from 'react'
import { Currency } from '../types'

export interface CurrencyProviderType {
    currency: Currency
    toggle: (currency?: Currency) => void
}

export const CurrencyContext = createContext<CurrencyProviderType>({
    currency: Currency.UAH,
    toggle: () => {}
})

export const CurrencyProvider: FC<PropsWithChildren> = ({ children }) => {
    const storedCurrency = localStorage.getItem('currency') as Currency
    const [currency, setCurrency] = useState<Currency>(storedCurrency || Currency.UAH)
    
    const toggle = (newCurrency?: Currency) => {
        if (!newCurrency) {
            newCurrency = currency === Currency.UAH ? Currency.USD : Currency.UAH
        }
        
        localStorage.setItem('currency', newCurrency)
        setCurrency(newCurrency)
    }

    return (
        <CurrencyContext.Provider value={{
            currency,
            toggle
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}
