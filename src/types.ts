export type ProductId = string
export interface Product {
    id: ProductId
    name: string
    price: Record<Currency, number>
    shortDescription?: string
    description?: string
    images: string[]
    urls?: string[]
    sold?: boolean
    booked?: boolean | string
}

export type Cart = ProductId[]
export type Products = Product[]

export enum Currency {
    UAH = 'uah',
    USD = 'usd'
}
