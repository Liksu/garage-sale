export type ProductId = string
export interface Product {
    id: ProductId
    name: string
    price: Record<string, number>
    shortDescription?: string
    description?: string
    images: string[]
    urls?: string[]
    sold?: boolean
    booked?: boolean | string
}

export type Cart = ProductId[]
export type Products = Product[]

export type Currency = string

export interface Dictionary {
    [key: string]: Translation
}

export type Translation = string | Array<string> | Dictionary

export interface Config {
    config: true
    defaultCurrency?: Currency
    defaultLanguage?: string
}
