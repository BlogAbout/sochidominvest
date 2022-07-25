declare module '*.module.css' {
    const classes: {
        readonly [key: string]: string
    }

    export default classes
}

declare module '*.module.sass' {
    const classes: {
        readonly [key: string]: string
    }

    export default classes
}

declare module '*.module.scss' {
    const classes: {
        readonly [key: string]: string
    }

    export default classes
}

interface Window {
    userId?: number
    popupParents?: any
    popupAutoCloseEvents?: any
    popupAutoFocusEvents?: any
    defaultDragDropContext?: any
    HTMLElement?: any
    StyleMedia?: any
    ym?: any
    events?: EventEmitter
    WS?: WS
}

declare module 'react-lightgallery'
declare module 'react-helmet'
declare module 'showdown'
declare module 'video-react'