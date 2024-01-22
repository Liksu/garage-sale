import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react'
import { useLoader } from './use-loader'
import { Dictionary, Translation } from '../types'


export interface TranslationProviderType {
    dictionary: Dictionary
    t: (key: string) => string
    ta: (key: string) => Array<string>
    to: (key: string) => Dictionary
}

export const TranslationContext = createContext<TranslationProviderType>({
    dictionary: {},
    t: () => '',
    ta: () => [],
    to: () => ({})
})

export const TranslationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [dictionary, setDictionary] = useState<Dictionary>({})
    const [loading, loadTranslations] = useLoader<Dictionary>({
        param: 'lang',
        defaultURL: '/data/lang.ua.json',
        defaultValue: {}
    })

    useEffect(() => {
        loadTranslations()
            .then(setDictionary)
            .catch(console.error)
    }, [])
    
    const extract = (path: string, context: Translation = dictionary): Translation | Array<Translation> => {
        const keys = path.split('.')
        let processed: Array<string> = []
        
        for (const key of keys) {
            processed.push(key)
            if (typeof context !== 'object') return context
            if (Array.isArray(context) && key === '*') {
                const restPath = path.replace(processed.join('.') + '.', '')
                return context.map(item => extract(restPath, item)) as Array<Translation>
            }
            if (Array.isArray(context) && !context[Number(key)]) return key
            if (!(context as Dictionary)[key]) return key
            context = (context as Dictionary)[key]
        }
        
        return context
    }
    
    const t = (path: string): string => {
        const translation = extract(path)
        if (typeof translation === 'string') return translation
        if (Array.isArray(translation)) return (translation as Array<Translation>).filter(item => typeof item === 'string').join(' ')
        return ''
    }
    
    const ta = (path: string): Array<string> => {
        const translation = extract(path)
        if (typeof translation === 'string') return [translation]
        if (Array.isArray(translation)) return (translation as Array<Translation>).filter(item => typeof item === 'string') as Array<string>
        return []
    }
    
    const to = (path: string): Dictionary => {
        const translation = extract(path)
        if (Array.isArray(translation)) return { [path]: (translation as Array<Translation>).filter(item => typeof item === 'string').join(' ') }
        if (typeof translation === 'object') return translation as Dictionary
        if (translation != null) return { [path]: translation }
        return {}
    }

    return (
        <TranslationContext.Provider value={{
            dictionary,
            t,
            ta,
            to
        }}>
            {children}
        </TranslationContext.Provider>
    )
}