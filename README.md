# Garage Sale

Front-end for garage sales that allows to provide items to sale from external resources.

## Set Products

Query parameter `products` should refer to the json with a list products.

```
?products=https://sale.liksu.com/data/products.json
```

Type of data:

```ts
Array<{
    id: string
    name: string
    price: number | Record<string, number>
    images: Array<string>
    condition?: string
    tags?: Array<string>
    shortDescription?: string
    description?: string
    urls?: Array<string>
    sold?: boolean
    booked?: boolean | string
}>
```

To correct display of a price, the `price` keys should be one of the currency code (ISO 4217).

The `id` should not contain any special characters that could be incorrectly escaped in URL and also should not contain commas (it used as cart list share separator).

## Configuration

In the list of products you can add an configuration object this required `"config": true`. It is the place to set default currency and languages.

Type of configuration object:

```ts
{
    config: true
    defaultCurrency?: Currency
    defaultLanguage?: string
    languages?: Array<string>
}
```

## Set translation

Query parameter `lang` should refer to json that contains translations for the site.

```
/?lang=https://sale.liksu.com/data/lang.en.json
```

Structure of translation:

```json
{
  "empty cart": "The cart is empty",
  "total": "Total",
  "share cart": "Share cart",
  "share cart description": [
    "To send a request for booking - copy the selected products and send it to us by email or messenger.",
    "Also, you can share the selected products using the link."
  ],
  "copy text": "Copy text",
  "copy link": "Copy link",
  "copied": "Copied",
  "make a copy": "Make a copy",
  "selected products": "Selected products",
  "no products": "No products",
  "product categories": [
    "Available",
    "Booked",
    "Sold"
  ],
  "booked": "Booked",
  "sold": "Sold",
  "show more": "Show more",
  "hide": "Hide",
  "I want this": ["I want this", "Don't want it anymore"],
  "condition": "Condition"
}
```

#### TODO

- Support different currencies
- Support different languages
- Support deep structure of products json like `{"products": [...], "config": {...}, "total": 100, "page": 1...}`
- Add GA
- Support of @user configurations
