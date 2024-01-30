import { useContext, useState } from 'react'
import { ConfigContext } from './config-provider'
import { ResponseList } from '../types'

interface LoaderHookConfig<T> {
    param: string
    defaultURL?: string
    defaultValue: T
    onLoad?: (data: T) => void
}

export const useLoader = <T = unknown[]>({ param, defaultURL, defaultValue, onLoad }: LoaderHookConfig<T>): [boolean, () => Promise<T>] => {
    const [loading, setLoading] = useState(false)
    const { extractConfigs } = useContext(ConfigContext)
    
    const link = window.params.get(param) ?? defaultURL
    if (!link) return [false, async () => defaultValue]
    
    const isJS = link.endsWith('.js')

    const loader = () => {
        setLoading(true)
        
        return new Promise<T>(async (resolver, reject) => {
            const resolve = (data: ResponseList<T>) => {
                setLoading(false)
                const res = extractConfigs(data) as T
                if (onLoad) onLoad(res)
                resolver(res)
            }
            
            let response
            try {
                response = await fetch(link, { cache: 'no-store', mode: 'no-cors' })
            } catch (e) {
                response = new Response(null, { statusText: 'try:proxy' })
            }
            if (response.statusText === 'try:proxy' || response.type === 'opaque' || response.status === 0) {
                response = await fetch(`/api/proxy?url=${encodeURIComponent(link)}`)
            }
            if (!response.ok) return reject(response.statusText)
            
            const data = await response[isJS ? 'text' : 'json']()
            
            if (isJS) {
                if (window.Worker) {
                    const worker = new Worker('/loader.js')
                    worker.postMessage(data)
                    worker.onmessage = (event: MessageEvent<ResponseList<T>>) => {
                        if (Array.isArray(event.data)) resolve(event.data)
                        else resolve(defaultValue as ResponseList<T>)
                    }
                } else {
                    reject(new Error( 'Cannot parse JS file'))
                }
                
                return
            }
            
            resolve(data)
        })
    }

    return [loading, loader]
}
