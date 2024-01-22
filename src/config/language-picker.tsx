import { ReactElement, useContext } from 'react'
import { ConfigContext } from '../helpers/config-provider'
import { Image } from '@mantine/core'

export default function LanguagePicker(): ReactElement {
    const { languages } = useContext(ConfigContext)

    return (<>
        {languages.map((language) => (
            <Image key={language}
                   src={`https://unpkg.com/language-icons/icons/${language.toLowerCase()}.svg`}
                   w={24}
                   alt={language} />
        ))}
    </>)
}
