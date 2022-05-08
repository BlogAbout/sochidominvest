import * as React from 'react'
import {openPopup} from '../../../helpers/popupHelper'
import {PopupDisplayOptions} from '../../../@types/IPopup'
import classes from './BackgroundBlock.module.scss'

interface Props {
    backgroundColor: 'white' | 'black'
}

const defaultProps: Props = {
    backgroundColor: 'white'
}

const BackgroundBlock: React.FC<Props> = (props) => {
    return (
        <div className={classes[`block-${props.backgroundColor}`]}
             style={{
                 width: document.body.offsetWidth,
                 height: document.body.offsetHeight
             }}
        />
    )
}

BackgroundBlock.defaultProps = defaultProps

export default function showBackgroundBlock(e: any, popupProps = {}, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(BackgroundBlock, popupProps, undefined, e, displayOptions)
}