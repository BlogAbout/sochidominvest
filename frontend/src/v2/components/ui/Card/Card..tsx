import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {getFormatDate} from '../../../../helpers/dateHelper'
import Avatar from '../../../../components/ui/Avatar/Avatar'
import Title from '../Title/Title'
import classes from './Card.module.scss'

interface Props extends React.PropsWithChildren<any> {
    title: string
    avatar: string
    views?: number
    date?: string
    author?: string
    type?: string
    phone?: string
    countBuildings?: number
    isDisabled?: boolean
    className?: string

    onClick?(): void

    onContextMenu?(e: React.MouseEvent): void
}

const defaultProps: Props = {
    title: '',
    avatar: '',
    isDisabled: false
}

const cx = classNames.bind(classes)

const Card: React.FC<Props> = (props) => {
    return (
        <div className={cx({'Card': true, 'disabled': props.isDisabled}, props.className)}
             onClick={() => {
                 if (props.onClick) {
                     props.onClick()
                 }
             }}
             onContextMenu={(e: React.MouseEvent) => {
                 if (props.onContextMenu) {
                     props.onContextMenu(e)
                 }
             }}
        >
            <Avatar href={props.avatar} alt={props.title} width={150} height={150}/>

            <div className={classes.itemContent}>
                <Title type='h2'>{props.title}</Title>

                {props.date ?
                    <div className={classes.row} title='Дата публикации'>
                        <FontAwesomeIcon icon='calendar'/>
                        <span>{getFormatDate(props.date)}</span>
                    </div>
                    : null
                }

                {props.type ?
                    <div className={classes.row} title='Тип'>
                        <FontAwesomeIcon icon='star'/>
                        <span>{props.type}</span>
                    </div>
                    : null
                }

                {props.phone ?
                    <div className={classes.row} title='Телефон'>
                        <FontAwesomeIcon icon='phone'/>
                        <span>{props.phone}</span>
                    </div>
                    : null
                }

                {props.countBuildings !== undefined ?
                    <div className={classes.row} title='Количество объектов недвижимости'>
                        <FontAwesomeIcon icon='building'/>
                        <span>{props.countBuildings}</span>
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

Card.defaultProps = defaultProps
Card.displayName = 'Card'

export default React.memo(Card)