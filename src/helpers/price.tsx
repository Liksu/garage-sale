import { ReactElement, useContext } from 'react'
import { CurrencyContext } from './currency-provider'
import { Currency, Product } from '../types'

interface PriceProps {
    sum?: Product['price'] | number
    currency?: Currency | null
}

export default function Price({ sum = 0, currency }: PriceProps): ReactElement {
    const { currency: providedCurrency } = useContext(CurrencyContext)
    currency ||= providedCurrency
    
    if (typeof sum === 'object') {
        const currencyKey = Object.keys(sum).find(key => key.toUpperCase() === currency?.toUpperCase())
        if (!currencyKey) return (<>?</>)
        sum = sum[currencyKey as Currency]
    }

    if (sum == null) return (<>?</>)

    const formatted = price(sum, currency)

    return (<>
        {formatted}
    </>)
}

export function price(sum: number, currency?: Currency | null, symbol = true): string {
    if (!currency) return Intl.NumberFormat(navigator.language, { maximumFractionDigits: 0 }).format(sum)
    
    return new Intl.NumberFormat(
        navigator.language,
        {
            currency,
            maximumFractionDigits: 0,
            style: 'currency',
            currencyDisplay: symbol ? 'narrowSymbol' : 'symbol'
        }).format(sum)
}
