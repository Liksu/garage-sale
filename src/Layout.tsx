import './Layout.css'
import { AppShell, Group, Title } from '@mantine/core'
import CartWidget from './cart/cart-widget'
import { Outlet, useMatch } from 'react-router-dom'
import LinkWithQuery from './helpers/link-with-query'

function Layout() {
    const isActive = useMatch('/') != null

    const logo = <Title order={4} c="dimmed">Sale</Title>

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header style={{ padding: 'var(--mantine-spacing-md)' }}>
                <Group style={{ height: '100%' }} justify="space-between">
                    {isActive
                        ? logo
                        : <LinkWithQuery to={'/'} style={{ textDecoration: 'none' }}>{logo}</LinkWithQuery>}
                    <CartWidget />
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

export default Layout
