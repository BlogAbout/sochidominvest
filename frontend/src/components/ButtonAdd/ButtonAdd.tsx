import React, {CSSProperties} from 'react'
import classNames from 'classnames/bind'
import styles from './ButtonAdd.module.scss'

interface Props extends React.HTMLAttributes<any> {
    title?: string
    className?: 'normal'
    type?: 'common' | 'new'
    margin?: string
    size?: 'S' | 'M'

    onClick(e: React.MouseEvent<HTMLElement>): void
}

const defaultProps: Props = {
    title: '',
    className: 'normal',
    type: 'common',
    margin: '0',
    size: 'S',
    onClick: (e: React.MouseEvent<HTMLElement>) => {
        console.log(e)
    }
}

const cx = classNames.bind(styles)

const ButtonAdd: React.FC<Props> = (props) => {
    const userStyle = props.className ? props.className : ''
    const buttonStyle = cx({[`${props.type}`]: true}, userStyle)

    let styleObj: CSSProperties = {margin: props.margin}
    if (props.size === 'M') {
        styleObj.height = '30px'
        styleObj.width = '91px'
        styleObj.fontSize = '14px'
        styleObj.border = '1px solid #019f36'
        styleObj.color = '#019f36'
    }

    const wholeButton = () => {
        return (
            <div className={styles['wholeButton']} title={props.title}>
                <div className={styles['textSide']} onClick={props.onClick}>
                    {props.children}
                </div>

                {crossOnly()}
            </div>
        )
    }

    const crossOnly = () => {
        return (
            <div className={styles['crossOnly']} onClick={props.onClick} title={props.title}/>
        )
    }

    if (props.type === 'new') {
        return (
            <div className={styles['newButton']}
                 title={props.title}
                 style={styleObj}
                 onClick={props.onClick}
            >
                {props.children}
            </div>
        )
    }

    return (
        <div className={buttonStyle}
             style={!props.children ? {width: "27px", margin: props.margin} : {margin: props.margin}}
        >
            {props.children ? wholeButton() : crossOnly()}
        </div>
    )
}

ButtonAdd.defaultProps = defaultProps
ButtonAdd.displayName = 'ButtonAdd'

export default ButtonAdd