import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {IArticle} from '../../../../@types/IArticle'
import {articleTypes} from '../../../../helpers/articleHelper'
import ArticleService from '../../../../api/ArticleService'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupArticleCreate from '../../../PopupArticleCreate/PopupArticleCreate'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
import classes from './ArticleItem.module.scss'

interface Props {
    article: IArticle

    onSave(): void
}

const defaultProps: Props = {
    article: {} as IArticle,
    onSave: () => {
        console.info('ArticleItem onSave')
    }
}

const ArticleItem: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    // Редактирование
    const updateHandler = (article: IArticle) => {
        openPopupArticleCreate(document.body, {
            article: article,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление
    const removeHandler = (article: IArticle) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${article.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (article.id) {
                            setFetching(true)

                            ArticleService.removeArticle(article.id)
                                .then(() => {
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
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
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: () => updateHandler(props.article)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(props.article)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const articleType = articleTypes.find(item => item.key === props.article.type)

    return (
        <div className={classes.ArticleItem}
             onClick={() => navigate('/panel/article/' + props.article.id)}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={classes.id}>#{props.article.id}</div>
            <div className={classes.name}>{props.article.name}</div>
            <div className={classes.author}>{props.article.authorName || ''}</div>
            <div className={classes.type}>{articleType ? articleType.text : ''}</div>
            <div className={classes.views}>{props.article.views}</div>
        </div>
    )
}

ArticleItem.defaultProps = defaultProps
ArticleItem.displayName = 'ArticleItem'

export default ArticleItem