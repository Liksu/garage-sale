import { NavigateOptions, To, useNavigate, useSearchParams } from 'react-router-dom'

const useNavigateWithQuery = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const navigateWithQuery = (to: To, options?: NavigateOptions) => {
        const currentQuery = searchParams.toString()
        navigate(`${to}${currentQuery ? `?${currentQuery}` : ''}`, options)
    }

    return navigateWithQuery
}

export default useNavigateWithQuery
