# Set Products

```
?products=https://sale.liksu.com/data/products.json
```

Type of data:

```ts
Array<{
    id: ProductId
    name: string
    price: Record<Currency, number>
    shortDescription?: string
    description?: string
    images: string[]
    urls?: string[]
    sold?: boolean
    booked?: boolean | string
}>
```
