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
import { TranslationProvider } from './helpers/translation-provider'
import { ConfigProvider } from './helpers/config-provider'

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
                path: ':productId',
                element: <ProductPage />
            },
            {
                index: true,
                element: <Catalog />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: '*',
                element: <div>404</div>
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
            <ConfigProvider>
                <TranslationProvider>
                    <DataProvider>
                        <CurrencyProvider>
                            <CartProvider>
                                <RouterProvider router={router} />
                            </CartProvider>
                        </CurrencyProvider>
                    </DataProvider>
                </TranslationProvider>
            </ConfigProvider>
        </MantineProvider>
    </React.StrictMode>
)
