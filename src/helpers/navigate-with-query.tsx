import React, { FC } from 'react'
import { Navigate, NavigateProps, useLocation } from 'react-router-dom'

const NavigateWithQuery: FC<NavigateProps> = ({ to, replace = true, state }) => {
    const location = useLocation()
    const search = location.search

    return <Navigate to={to + search} replace={replace} state={state} />
}

export default NavigateWithQuery
