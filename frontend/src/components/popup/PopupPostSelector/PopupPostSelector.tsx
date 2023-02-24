import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import PostService from '../../../api/PostService'
import {IPost} from '../../../@types/IPost'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import openPopupPostCreate from '../../popup/PopupPostCreate/PopupPostCreate'
import {openPopup, removePopup} from '../../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../ui/Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import ButtonAdd from '../../form/ButtonAdd/ButtonAdd'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './PopupPostSelector.module.scss'

interface Props extends PopupProps {
    exclude?: number[]
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    exclude: [],
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupPostSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupPostSelector onSelect', value)
    }
}

const PopupPostSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPost, setFilterPost] = useState<IPost[]>([])
    const [selectedPosts, setSelectedPosts] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingPostList, posts} = useTypedSelector(state => state.postReducer)
    const {fetchPostList} = useActions()

    useEffect(() => {
        if (!posts.length || isUpdate) {
            fetchPostList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [posts])

    useEffect(() => {
        setFetching(fetchingPostList)
    }, [fetchingPostList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (post: IPost) => {
        if (props.multi) {
            selectRowMulti(post)
        } else if (props.onSelect !== null) {
            props.onSelect(post.id ? [post.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (post: IPost) => {
        if (post.id) {
            if (checkSelected(post.id)) {
                setSelectedPosts(selectedPosts.filter((key: number) => key !== post.id))
            } else {
                setSelectedPosts([...selectedPosts, post.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedPosts.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterPost(posts.filter((post: IPost) => {
                return post.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 && (!post.id || !props.exclude || !props.exclude.length || !props.exclude.includes(post.id))
            }))
        } else {
            setFilterPost(posts.filter((post: IPost) => !post.id || (props.exclude && !props.exclude.includes(post.id))))
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupPostCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, post: IPost) => {
        openPopupPostCreate(e.currentTarget, {
            post: post,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedPosts)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, post: IPost) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${post.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (post.id) {
                            PostService.removePost(post.id)
                                .then(() => {
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                        onOk: close.bind(this)
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

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, post: IPost) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, post)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, post)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderLeftBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 36}}>
                    {renderSearch()}
                </div>
                <div className={classes['box_border']} style={{height: 300}}>
                    {!props.multi ? renderLeftTab() :
                        <div className={classes['box_content_wrapper']}>
                            {renderLeftTab()}
                        </div>
                    }
                </div>
            </div>
        )
    }

    const renderSearch = () => {
        return (
            <div className={classes['search_and_button']}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterPost ? filterPost.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null}
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {filterPost.length ?
                    filterPost.map((post: IPost) => renderRow(post, 'left', checkSelected(post.id)))
                    :
                    <Empty message={!posts.length ? 'Нет статей' : 'Должности не найдены'}/>
                }
            </div>
        )
    }

    const renderRightBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 36, flex: 'none'}}/>
                <div className={classes['box_border']} style={{height: 400}}>
                    {renderRightTab()}
                </div>
            </div>
        )
    }

    const renderRightTab = () => {
        const rows = filterPost.filter((post: IPost) => checkSelected(post.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((post: IPost) => renderRow(post, 'right', checkSelected(post.id))) : ''}
            </div>
        )
    }

    const renderRow = (post: IPost, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={post.id}
                 onClick={() => selectRow(post)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, post)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic' onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                <div className={classes['item_name']}>{post.name}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать должность' popupId={props.id || ''} onClose={() => close()}/>

            <BlockingElement fetching={fetching}>
                <Content className={props.multi ? classes['content_multi'] : classes['content']}>
                    {renderLeftBox()}

                    {!props.multi ? null : renderRightBox()}
                </Content>

                {props.multi ?
                    <Footer>
                        <Button type='apply'
                                icon='check'
                                onClick={() => onClickSave()}
                                className='marginLeft'
                        >Сохранить</Button>

                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={close.bind(this)}
                                className='marginLeft'
                        >Отменить</Button>
                    </Footer>
                    :
                    <div className={classes['footer_spacer']}/>
                }
            </BlockingElement>
        </Popup>
    )
}

PopupPostSelector.defaultProps = defaultProps
PopupPostSelector.displayName = 'PopupPostSelector'

export default function openPopupPostSelector(target: any, popupProps = {} as Props, displayOptions: PopupDisplayOptions = {} as PopupDisplayOptions) {
    return openPopup(withStore(PopupPostSelector), popupProps, undefined, target, displayOptions)
}