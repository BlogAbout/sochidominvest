import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import openPopupDeveloperCreate from '../../../components/PopupDeveloperCreate/PopupDeveloperCreate'
import Button from '../../../components/Button/Button'
import DeveloperList from '../../../components/DeveloperList/DeveloperList'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './DeveloperPage.module.scss'

const DeveloperPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {developers, fetching} = useTypedSelector(state => state.developerReducer)
    const {fetchDeveloperList} = useActions()

    useEffect(() => {
        if (isUpdate || !developers.length) {
            fetchDeveloperList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление нового застройщика
    const onClickAddHandler = () => {
        openPopupDeveloperCreate(document.body, {
            onSave: () => {
                onSave()
            }
        })
    }

    return (
        <main className={classes.DeveloperPage}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Застройщики - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Застройщики</span>
                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                </h1>

                <DeveloperList developers={developers} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

DeveloperPage.displayName = 'UserPage'

export default DeveloperPage