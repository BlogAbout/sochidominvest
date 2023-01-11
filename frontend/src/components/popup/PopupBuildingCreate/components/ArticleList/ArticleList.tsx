import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IArticle} from '../../../../../@types/IArticle'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupArticleSelector from '../../../../PopupArticleSelector/PopupArticleSelector'
import Preloader from '../../../../Preloader/Preloader'
import classes from './ArticleList.module.scss'

interface Props {
    selected: number[]

    onSelect(value: number[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (value: number[]) => {
        console.info('BuildingList onSelect', value)
    }
}

const ArticleList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [selectedArticles, setSelectedArticles] = useState<IArticle[]>([])

    const {fetching: fetchingArticleList, articles} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (!articles.length || isUpdate) {
            fetchArticleList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (articles && articles.length) {

            setSelectedArticles(articles.filter((article: IArticle) => article.id && props.selected.includes(article.id)))
        } else {
            setSelectedArticles([])
        }
    }, [articles, props.selected])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление элемента из списка
    const selectHandler = () => {
        openPopupArticleSelector(document.body, {
            selected: props.selected,
            buttonAdd: true,
            multi: true,
            onSelect: (value: number[]) => props.onSelect(value),
            onAdd: () => onSave()
        })
    }

    // Удаление элемента из списка
    const removeHandler = (article: IArticle) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${article.name} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        const removeSelectedList: number[] = props.selected.filter((item: number) => item !== article.id)
                        props.onSelect(removeSelectedList)
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, article: IArticle) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => removeHandler(article)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.ArticleList}>
            {fetchingArticleList && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Название</div>
                <div className={classes.type}>Тип</div>
            </div>

            <div className={classes.addArticle} onClick={selectHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetchingArticleList} className={classes.list}>
                {selectedArticles && selectedArticles.length ?
                    selectedArticles.map((article: IArticle) => {
                        return (
                            <div key={article.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, article)}
                            >
                                <div className={classes.name}>{article.name}</div>
                                <div className={classes.type}>{getArticleTypeText(article.type)}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет связанных статей'/>
                }
            </BlockingElement>
        </div>
    )
}

ArticleList.defaultProps = defaultProps
ArticleList.displayName = 'ArticleList'

export default ArticleList