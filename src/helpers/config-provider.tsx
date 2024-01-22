import { Config, Currency } from '../types'
import { createContext, FC, PropsWithChildren, useState } from 'react'

export interface ConfigProviderType {
    defaultCurrency: Currency | null
    defaultLanguage: string
    updateConfig: (config: Config) => void
    separateConfigs: <T = unknown>(data: Array<Config | T>) => [Array<Config>, Array<T>]
    extractConfigs: <T = unknown>(data: Array<Config | T>) => Array<T>
}

export const ConfigContext = createContext<ConfigProviderType>({
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    updateConfig: () => {},
    separateConfigs: () => [[], []],
    extractConfigs: () => [],
})

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => {
    const [defaultCurrency, setDefaultCurrency] = useState<Currency | null>(null)
    const [defaultLanguage, setDefaultLanguage] = useState<string>('en')
    
    const updateConfig = (config: Config) => {
        if (config.defaultCurrency) setDefaultCurrency(config.defaultCurrency)
        if (config.defaultLanguage) setDefaultLanguage(config.defaultLanguage)
    }
    
    const extractConfigs = <T = unknown>(data: Array<Config | T>): Array<T> => {
        return data.reduce((items, item) => {
            if (!(item as Config).config) items.push(item as T)
            else updateConfig(item as Config)
            
            return items
        }, [] as Array<T>)
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
            updateConfig,
            separateConfigs,
            extractConfigs,
        }}>
            {children}
        </ConfigContext.Provider>
    )
}