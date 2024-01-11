import React from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import './index.css'
import Layout from './Layout'
import { createTheme, MantineProvider } from '@mantine/core'
import { DataProvider } from './data/data-provider'
import { CartProvider } from './cart/cart-provider'
import { CurrencyProvider } from './helpers/currency-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProductPage from './product/product-page'
import Catalog from './list/catalog'
import Cart from './cart/cart'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const theme = createTheme({
    /** Put your mantine theme override here */
})

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Catalog />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: ':productId',
                element: <ProductPage />
            }
        ]
    },
])

declare global {
    interface Window {
        params: URLSearchParams
    }
}

root.render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <CurrencyProvider>
                <DataProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </DataProvider>
            </CurrencyProvider>
        </MantineProvider>
    </React.StrictMode>
)
