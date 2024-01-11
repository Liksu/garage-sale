import React, { FC, PropsWithChildren } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'

const LinkWithQuery: FC<PropsWithChildren<LinkProps>> = ({ to, children, ...props }) => {
    const location = useLocation()
    const search = location.search

    return (
        <Link to={to + search} {...props}>
            {children}
        </Link>
    )
}

export default LinkWithQuery
