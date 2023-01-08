import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getFormatDate} from '../../../../../helpers/dateHelper'
import {ICompilation} from '../../../../../@types/ICompilation'
import CompilationService from '../../../../../api/CompilationService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupCompilationCreate from '../../../../../components/PopupCompilationCreate/PopupCompilationCreate'
import classes from './CompilationList.module.scss'

interface Props {
    list: ICompilation[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('AgentList onSave')
    }
}

const CompilationList: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(props.fetching)

    // Редактирование элемента
    const updateHandler = (compilation: ICompilation) => {
        openPopupCompilationCreate(document.body, {
            compilation: compilation,
            onSave: () => props.onSave()
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
                                    props.onSave()
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
    const onContextMenu = (compilation: ICompilation, e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(compilation)},
            {text: 'Удалить', onClick: () => removeHandler(compilation)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <List className={classes.CompilationList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.date}>Дата создания</ListCell>
                <ListCell className={classes.count}>Количество</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((compilation: ICompilation) => {
                        return (
                            <ListRow key={compilation.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenu(compilation, e)}
                                     onClick={() => navigate('/compilation/' + compilation.id)}
                                     isDisabled={!compilation.active}
                            >
                                <ListCell className={classes.name}>{compilation.name}</ListCell>
                                <ListCell className={classes.date}>{getFormatDate(compilation.dateCreated)}</ListCell>
                                <ListCell className={classes.count}>
                                    {compilation.buildings ? compilation.buildings.length : 0}
                                </ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет подборок'/>
                }
            </ListBody>
        </List>
    )
}

CompilationList.defaultProps = defaultProps
CompilationList.displayName = 'CompilationList'

export default React.memo(CompilationList)