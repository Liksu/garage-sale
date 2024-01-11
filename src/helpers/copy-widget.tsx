import { ReactElement } from 'react'
import { Button } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useClipboard } from '@mantine/hooks'

interface CopyWidgetProps {
    value: string | (() => string)
    text?: string
    icon?: ReactElement
}

export default function CopyWidget({ value, text, icon }: CopyWidgetProps): ReactElement {
    const { copy, copied } = useClipboard({timeout: 3000})

    const click = () => {
        const content = typeof value === 'function' ? value() : value
        copy(content)
    }
    
    if (copied) {
        return <Button disabled leftSection={<IconCheck />}>Скопійовано</Button>
    }
    
    return <Button onClick={click} leftSection={icon ?? <IconCopy />}>{text ?? 'Скопіювати'}</Button>
}
