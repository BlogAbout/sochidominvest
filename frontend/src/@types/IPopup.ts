import React from 'react'

export interface PopupProps extends React.Attributes {
    id?: string,
    blockId?: string
}

export interface PopupDisplayOptions {
    fullScreen?: boolean
    rightPanel?: boolean
    leftPanel?: boolean
    alwaysTop?: boolean
    offsetLeft?: number
    offsetTop?: number
    center?: boolean
    animate?: string
    shiftMethod?: boolean
    updatePosition?: boolean
    autoClose?: boolean
    autoFocus?: boolean

    onAutoClose?(): void
}

export interface PopupShiftMethod {
    top: number
    left: number
}

export interface PopupPositionCorrector {
    width: boolean
    height: boolean
    shiftMethod: boolean
}