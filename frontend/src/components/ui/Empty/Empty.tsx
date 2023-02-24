import * as React from 'react'
import styles from './Empty.module.scss'

interface Props {
    message?: string
}

const defaultProps: Props = {
    message: 'Нет данных',
}

const Empty: React.FC<Props> = (props) => {
    return (
        <div className={styles['container']}>{props.message}</div>
    )
}

Empty.defaultProps = defaultProps
Empty.displayName = 'Empty'

export default Empty