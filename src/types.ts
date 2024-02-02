export type ProductId = string
export interface Product {
    id: ProductId
    name: string
    price: Record<string, number>
    condition?: string
    tags?: string[]
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
    languages?: string[]
}

export type ResponseList<T> = Array<(T extends Array<infer U> ? U : T) | Config>

export type PromiseHolder<T> = {resolve: (value: (T | PromiseLike<T>)) => void}
