import React from 'react'
import classes from './Card.module.scss'

interface Props extends React.PropsWithChildren<any> {

}

const defaultProps: Props = {

}

const Card: React.FC<Props> = (props) => {
    return (
        <div className={classes.Card}>
            {props.children}
        </div>
    )
}

Card.defaultProps = defaultProps
Card.displayName = 'Card'

export default Card