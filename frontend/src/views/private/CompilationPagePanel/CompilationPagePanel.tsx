import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {ICompilation} from '../../../@types/ICompilation'
import openPopupCompilationCreate from '../../../components/PopupCompilationCreate/PopupCompilationCreate'
import Button from '../../../components/Button/Button'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import CompilationService from '../../../api/CompilationService'
import classes from './CompilationPagePanel.module.scss'

const CompilationPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)

    const {compilations, fetching: fetchingCompilationList} = useTypedSelector(state => state.compilationReducer)
    const {fetchCompilationList} = useActions()

    useEffect(() => {
        if (isUpdate || !compilations.length) {
            fetchCompilationList()

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        setFetching(fetchingCompilationList)
    }, [fetchingCompilationList])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление нового элемента
    const onClickAddHandler = () => {
        openPopupCompilationCreate(document.body, {
            onSave: () => onSave()
        })
    }

    // Редактирование элемента
    const updateHandler = (compilation: ICompilation) => {
        openPopupCompilationCreate(document.body, {
            compilation: compilation,
            onSave: () => onSave()
        })
    }

    // Удаление элемента
    const removeHandler = (compilation: ICompilation) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить подборку "${compilation.name}"? Все объекты из нее также будут удалены!`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (compilation.id) {
                            CompilationService.removeCompilation(compilation.id)
                                .then(() => {
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, compilation: ICompilation) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(compilation)},
            {text: 'Удалить', onClick: () => removeHandler(compilation)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <main className={classes.CompilationPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Подборки - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Подборки</span>

                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                </h1>

                <div className={classes.CompilationList}>
                    <div className={classes.head}>
                        <div className={classes.name}>Название</div>
                        <div className={classes.date}>Дата создания</div>
                        <div className={classes.count}>Количество</div>
                    </div>

                    {compilations && compilations.length ?
                        <BlockingElement fetching={fetchingCompilationList || fetching} className={classes.list}>
                            {compilations.map((compilation: ICompilation) => {
                                return (
                                    <div key={compilation.id} className={classes.CompilationItem}
                                         onClick={() => navigate('/panel/compilation/' + compilation.id)}
                                         onContextMenu={(e: React.MouseEvent) => onContextMenu(e, compilation)}
                                    >
                                        <div className={classes.name}>{compilation.name}</div>
                                        <div className={classes.date}>{compilation.dateCreated}</div>
                                        <div className={classes.count}>
                                            {compilation.buildings ? compilation.buildings.length : 0}
                                        </div>
                                    </div>
                                )
                            })}
                        </BlockingElement>
                        : <Empty message='Нет подборок'/>
                    }
                </div>
            </div>
        </main>
    )
}

CompilationPagePanel.displayName = 'CompilationPagePanel'

export default CompilationPagePanel