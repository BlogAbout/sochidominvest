import React, {useEffect, useState} from 'react'
import {IUser} from '../../../@types/IUser'
import openPopupUserSelector from '../../popup/PopupUserSelector/PopupUserSelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    users?: number[]
    multi?: boolean
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    errorText?: string

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    users: [],
    multi: false,
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('UserBox onSelect', value, e)
    }
}

const UserBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length) {
            fetchUserList({active: [0, 1]})
        }
    }, [])

    useEffect(() => {
        updateSelectedInfo()
    }, [users, props.users])

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupUserSelector(document.body, {
            multi: props.multi,
            selected: props.users,
            onSelect: (value: number[]) => {
                props.onSelect(value, e)
            }
        })
    }

    // Обработчик сброса выбора
    const resetHandler = (e: React.MouseEvent) => {
        props.onSelect([], e)
    }

    // Обновление отображаемого текста в поле по выбранному значению
    const updateSelectedInfo = () => {
        let tmpText = ''
        let tmpTitle = ''

        if (props.users && props.users.length) {
            const firstUserId: number = props.users[0]
            const usersNames: string[] = []
            const userFirstInfo = users.find((user: IUser) => user.id === firstUserId)

            if (userFirstInfo) {
                tmpText += userFirstInfo.firstName
            }

            if (props.users.length > 1) {
                tmpText += ` + ещё ${props.users.length - 1}`
            }

            props.users.map((id: number) => {
                const userInfo = users.find((user: IUser) => user.id === id)
                if (userInfo) {
                    usersNames.push(userInfo.firstName)
                }
            })

            tmpTitle = usersNames.join('\n')
        }

        setText(tmpText)
        setTitle(tmpTitle)
    }

    const {onSelect, ...otherProps} = props
    return (
        <Box {...otherProps}
             value={text}
             type='picker'
             title={otherProps.title || title}
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
        />
    )
}

UserBox.defaultProps = defaultProps
UserBox.displayName = 'UserBox'

export default UserBox