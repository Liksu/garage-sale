import { Config, Currency, ResponseList } from '../types'
import { createContext, FC, PropsWithChildren, useState } from 'react'

export interface ConfigProviderType {
    defaultCurrency: Currency | null
    defaultLanguage: string
    languages: Array<string>
    updateConfig: (config: Config) => void
    separateConfigs: <T = unknown>(data: Array<Config | T>) => [Array<Config>, Array<T>]
    extractConfigs: <T extends Array<unknown>, K = T extends Array<infer I> ? I : never>(data: ResponseList<T>) => Array<K>
}

export const ConfigContext = createContext<ConfigProviderType>({
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    languages: ['en', 'uk'],
    updateConfig: () => {},
    separateConfigs: () => [[], []],
    extractConfigs: <T,>() => [] as T
})

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
    const [defaultCurrency, setDefaultCurrency] = useState<Currency | null>(null)
    const [defaultLanguage, setDefaultLanguage] = useState<string>('en')
    const [languages, setLanguages] = useState<Array<string>>(['en', 'uk'])
    
    const updateConfig = (config: Config) => {
        if (config.defaultCurrency) setDefaultCurrency(config.defaultCurrency)
        if (config.defaultLanguage) setDefaultLanguage(config.defaultLanguage)
        if (config.languages && Array.isArray(config.languages)) setLanguages(config.languages)
    }
    
    const extractConfigs = <T extends Array<unknown>, K = T extends Array<infer I> ? I : never>(data: ResponseList<T>): Array<K> => {
        if (!data || !Array.isArray(data)) return data
        
        return data.reduce((items, item) => {
            if (!(item as Config).config) items.push(item as K)
            else updateConfig(item as Config)
            
            return items
        }, [] as Array<K>)
    }
    
    const separateConfigs = <T = unknown>(data: Array<Config | T>): [Array<Config>, Array<T>] => {
        return data.reduce(([configs, items], item) => {
            if ((item as Config).config) configs.push(item as Config)
            else items.push(item as T)
            
            return [configs, items]
        }, [[] as Array<Config>, [] as Array<T>])
    }
    
    return (
        <ConfigContext.Provider value={{
            defaultCurrency,
            defaultLanguage,
            languages,
            updateConfig,
            separateConfigs,
            extractConfigs,
        }}>
            {children}
        </ConfigContext.Provider>
    )
}