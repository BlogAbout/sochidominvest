import React from 'react'
import classNames from 'classnames/bind'
import Label from '../../ui/Label/Label'
import classes from './Field.module.scss'

interface Props extends React.PropsWithChildren<any> {
    label?: string
    title?: string
    style?: 'light' | 'dark'
    type?: 'hor' | 'vert'
    labelWidth?: number | string
}

const defaultProps: Props = {
    label: '',
    title: '',
    style: 'light',
    type: 'vert'
}

const cx = classNames.bind(classes)

const Field: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'Field': true, [props.type || 'vert']: true})}>
            {props.label ?
                <Label text={props.label}
                       title={props.title}
                       style={props.style}
                       width={props.labelWidth}
                />
                : null
            }

            {props.children}
        </div>
    )
}

Field.defaultProps = defaultProps
Field.displayName = 'Field'

export default React.memo(Field)