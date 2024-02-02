# Set Products

```
?products=https://sale.liksu.com/data/products.json
```

Type of data:

```ts
Array<{
    id: string
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
}>
```

To correct display of a price, the `price` keys should be one of the currency code (ISO 4217).

The `id` should not contain any special characters that could be incorrectly escaped in URL and also should not contain commas (it used as cart list share separator).

#### TODO

- Support different currencies
- Support different languages
- Add GA