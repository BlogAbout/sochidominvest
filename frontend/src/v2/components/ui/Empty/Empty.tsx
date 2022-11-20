import * as React from 'react'
import styles from './Empty.module.scss'

interface Props {
    message?: string
}

const defaultProps: Props = {
    message: 'Нет данных',
}

const Empty: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={styles.Empty}>{props.message}</div>
    )
}

Empty.defaultProps = defaultProps
Empty.displayName = 'Empty'

export default React.memo(Empty)