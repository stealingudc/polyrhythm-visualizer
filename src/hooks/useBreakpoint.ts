import { useState, useEffect } from 'react'

export default () => {
    const [breakpoint, setBreakpoint] = useState(window.innerWidth)
    const resize = () => {
        setBreakpoint(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    return breakpoint
}
