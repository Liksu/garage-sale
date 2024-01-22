import { ReactElement, useContext } from 'react'
import { Button } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useClipboard } from '@mantine/hooks'
import { TranslationContext } from './translation-provider'

interface CopyWidgetProps {
    value: string | (() => string)
    text?: string
    icon?: ReactElement
}

export default function CopyWidget({ value, text, icon }: CopyWidgetProps): ReactElement {
    const { copy, copied } = useClipboard({timeout: 3000})
    const { t } = useContext(TranslationContext)

    const click = () => {
        const content = typeof value === 'function' ? value() : value
        copy(content)
    }
    
    if (copied) {
        return <Button disabled leftSection={<IconCheck />}>{t('copied')}</Button>
    }
    
    return <Button onClick={click} leftSection={icon ?? <IconCopy />}>{text ?? t('make a copy')}</Button>
}
