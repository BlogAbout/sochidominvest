import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './CheckBox.module.scss'

const cx = classNames.bind(classes)

interface Props extends React.PropsWithChildren<any> {
    type?: 'classic' | 'modern' | 'custom' | 'stars' // classic - стандартный с галочкой, modern - современный с переключателем, custom - со своими стилями
    checked: boolean
    readOnly?: boolean
    title?: string
    label: string
    labelSize?: '12px' | '14px' // Размер шрифта
    labelSide?: 'left' | 'right' | '' // С какой стороны label
    width?: number | string // Ширина label
    margin?: number | string
    flexGrow?: boolean
    styleChecked?: string // Стили для типа custom
    styleUnchecked?: string // Стили для типа custom
    onChange?(e: React.MouseEvent, value?: boolean): void
}

const defaultProps: Props = {
    type: 'classic',
    checked: false,
    readOnly: false,
    title: '',
    label: '',
    labelSize: '14px',
    labelSide: '',
    width: 'auto',
    margin: '',
    flexGrow: false,
    styleChecked: classes['check_on'],
    styleUnchecked: classes['check_off']
}

const CheckBox: React.FC<Props> = (props) => {
    const onClickHandler = (e: React.MouseEvent) => {
        if (!props.readOnly && props.onChange) {
            props.onChange(e, !props.checked)
        }
    }

    const renderClassic = () => {
        return (
            <div className={classes['box_classic']} style={{opacity: props.readOnly ? 0.5 : 1}}>
                <div className={props.checked ? classes['check_on'] : classes['check_off']}
                     onClick={onClickHandler.bind(this)}
                     style={{cursor: props.readOnly ? 'default' : 'pointer'}}
                >
                    {props.checked && <FontAwesomeIcon icon='check'/>}
                </div>
            </div>
        )
    }

    const renderModern = () => {
        return (
            <div className={classes['box_modern']} style={{opacity: props.readOnly ? 0.5 : 1}}>
                <div className={props.checked ? classes['ellipse_on'] : classes['ellipse_off']}
                     onClick={onClickHandler.bind(this)}
                     style={{cursor: props.readOnly ? 'default' : 'pointer'}}
                >
                    <div className={props.checked ? classes['circle_on'] : classes['circle_off']}
                         style={{cursor: props.readOnly ? 'default' : 'pointer'}}
                    />
                </div>
            </div>
        )
    }

    const renderCustom = () => {
        const checkStyle = cx({
            [`${props.styleChecked}`]: props.checked,
            [`${props.styleUnchecked}`]: !props.checked
        })

        return (
            <div className={checkStyle}
                 onClick={onClickHandler.bind(this)}
                 style={{opacity: props.readOnly ? 0.5 : 1, cursor: props.readOnly ? 'default' : 'pointer'}}
            />
        )
    }

    const renderStars = () => {
        const checkStyle = cx({
            [`${props.styleChecked}`]: props.checked,
            [`${props.styleUnchecked}`]: !props.checked
        })

        return (
            <div className={checkStyle}
                 onClick={onClickHandler.bind(this)}
                 style={{opacity: props.readOnly ? 0.5 : 1, cursor: props.readOnly ? 'default' : 'pointer'}}
            />
        )
    }

    const renderLabel = () => {
        return (
            !props.label ? null :
                <div
                    className={(props.type === 'modern' && props.labelSide === '') || props.labelSide === 'left' ? classes['label_left'] : classes['label_right']}
                    style={{
                        fontSize: props.labelSize,
                        cursor: props.readOnly ? 'default' : 'pointer',
                        width: props.width,
                        flexGrow: props.flexGrow ? 1 : undefined,
                        opacity: props.readOnly ? 0.5 : 1
                    }}
                    onClick={onClickHandler.bind(this)}
                >
                    {props.label}
                </div>
        )
    }


    return (
        <div className={classes['checkbox']} title={props.title}
             style={{
                 margin: props.margin,
                 flexGrow: props.flexGrow ? 1 : undefined
             }}
        >
            {(props.type === 'modern' && props.labelSide === '') || props.labelSide === 'left' ? renderLabel() : null}
            {props.type === 'classic' ? renderClassic() : null}
            {props.type === 'modern' ? renderModern() : null}
            {props.type === 'custom' ? renderCustom() : null}
            {props.type === 'stars' ? renderStars() : null}
            {(props.type === 'classic' && props.labelSide === '') || props.labelSide === 'right' ? renderLabel() : null}
        </div>
    )
}

CheckBox.defaultProps = defaultProps
CheckBox.displayName = 'CheckBox'

export default CheckBox