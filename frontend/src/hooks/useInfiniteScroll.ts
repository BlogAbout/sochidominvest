import {useCallback, useRef} from 'react'

const useInfiniteScroll = (callback: any, isFetching: boolean) => {
    const observer: any = useRef()

    const lastElementRef = useCallback(
        (node) => {
            if (isFetching) {
                return
            }

            if (observer.current) {
                observer.current.disconnect()
            }

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    callback()
                }
            })

            if (node) {
                observer.current.observe(node)
            }
        },
        [callback, isFetching]
    )

    return [lastElementRef]
}

export default useInfiniteScroll