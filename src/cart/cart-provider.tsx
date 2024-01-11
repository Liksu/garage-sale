// provider that handles adding/removing items from the cart and calculating the total price

import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Cart, Product, Products } from '../types'
import { DataContext } from '../data/data-provider'
import { CurrencyContext } from '../helpers/currency-provider'
import { useSearchParams } from 'react-router-dom'

export interface CartProviderType {
    addToCart: (id: string) => void
    removeFromCart: (id: string) => void
    checkCart: (id: string) => boolean
    byCart: (product: Product) => boolean
    toggleShowOnlyCart: () => void
    onlyCartView: boolean
    cart: Cart
    sum: number
}

export const CartContext = createContext<CartProviderType>({
    addToCart: (id: string) => {},
    removeFromCart: (id: string) => {},
    checkCart: (id: string) => false,
    byCart: (product: Product) => false,
    toggleShowOnlyCart: () => {},
    onlyCartView: false,
    cart: [],
    sum: 0
})

let initialCart: Cart | undefined = window.params.get('cart')?.split(',')
if (!initialCart) {
    const storedCart = window.localStorage.getItem('cart')
    initialCart = storedCart ? JSON.parse(storedCart) : []
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const { products } = useContext(DataContext)
    const [cart, setCart] = useState<Cart>(initialCart ?? [])
    const [sum, setSum] = useState(0)
    const { currency } = useContext(CurrencyContext)
    const [showOnlyCart, setShowOnlyCart] = useState(false)

    const addToCart = (id: string) => {
        setCart(() => [...cart.filter(itemId => itemId !== id), id])
    }
    
    const removeFromCart = (id: string) => {
        setCart(() => cart.filter(itemId => itemId !== id))
    }

    useEffect(() => {
        window.params.set('cart', cart.join(','))
        const sum = cart.reduce((acc, id) => acc + (products?.find(product => product.id === id && !product.sold)?.price[currency] || 0), 0)
        setSum(() => sum)
        window.localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart, products])

    const checkCart = (id: string) => {
        return cart.includes(id)
    }
    
    const byCart = (product: Product) => {
         return cart.includes(product.id)
    }
    
    const toggleShowOnlyCart = () => {
        if (!cart.length && !showOnlyCart) return
        setShowOnlyCart(() => !showOnlyCart)
    }
    
    return (
        <CartContext.Provider value={{
            addToCart,
            removeFromCart,
            checkCart,
            byCart,
            toggleShowOnlyCart,
            onlyCartView: showOnlyCart,
            cart,
            sum
        }}>
            {children}
        </CartContext.Provider>
    )
}
