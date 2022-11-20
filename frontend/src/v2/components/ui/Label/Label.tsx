import React from 'react'
import classNames from 'classnames/bind'
import classes from './Label.module.scss'

interface Props extends React.PropsWithChildren<any> {
    text: string
    title?: string
    style?: 'light' | 'dark'
    width?: number | string
}

const defaultProps: Props = {
    text: '',
    title: '',
    style: 'light'
}

const cx = classNames.bind(classes)

const Label: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'Label': true, [props.style || 'light']: true})}
             title={props.title}
             style={{width: props.width}}
        >
            <span className={classes.text} dangerouslySetInnerHTML={{__html: props.text}}/>

            {props.children}
        </div>
    )
}

Label.defaultProps = defaultProps
Label.displayName = 'Label'

export default Label