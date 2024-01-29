import React, { FC, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import './index.css'
import Layout from './Layout'
import { createTheme, MantineProvider } from '@mantine/core'
import { DataContext, DataProvider } from './data/data-provider'
import { CartProvider } from './cart/cart-provider'
import { CurrencyProvider } from './helpers/currency-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProductPage from './product/product-page'
import Catalog from './list/catalog'
import Cart from './cart/cart'
import { TranslationContext, TranslationProvider } from './helpers/translation-provider'
import { ConfigProvider } from './helpers/config-provider'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const theme = createTheme({
    /** Put your mantine theme override here */
})

const RoutableApp: FC = () => {
    const { loaderPromise: dataPromise } = useContext(DataContext)
    const { translationPromise } = useContext(TranslationContext)
    
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            errorElement: <div>404</div>,
            loader: () => Promise.all([
                dataPromise,
                translationPromise
            ]),
            children: [
                {
                    index: true,
                    element: <Catalog />
                },
                {
                    path: ':productId',
                    element: <ProductPage />
                },
                {
                    path: 'cart',
                    element: <Cart />
                },
            ]
        },
    ])

    return (
        <RouterProvider router={router} />
    )
}

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
                                <RoutableApp />
                            </CartProvider>
                        </CurrencyProvider>
                    </DataProvider>
                </TranslationProvider>
            </ConfigProvider>
        </MantineProvider>
    </React.StrictMode>
)
