import { ReactElement, useContext } from 'react'
import { CurrencyContext } from './currency-provider'
import { Currency, Product } from '../types'

interface PriceProps {
    sum?: Product['price'] | number
    currency?: Currency
}

export default function Price({ sum = 0, currency }: PriceProps): ReactElement {
    const { currency: providedCurrency } = useContext(CurrencyContext)
    if (!currency) {
        currency = providedCurrency
    }
    
    if (typeof sum === 'object') {
        sum = sum[currency]
    }

    const formatted = new Intl.NumberFormat('uk-UA', {maximumFractionDigits: 0, style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(sum)
    
    return (<>
        {formatted}
    </>)
}
