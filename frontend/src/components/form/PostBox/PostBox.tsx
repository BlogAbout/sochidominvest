import React, {useEffect, useState} from 'react'
import {IPost} from '../../../@types/IPost'
import openPopupPostSelector from '../../popup/PopupPostSelector/PopupPostSelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    posts?: number[]
    excludePosts?: number[]
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

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    posts: [],
    excludePosts: [],
    multi: false,
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('PostBox onSelect', value, e)
    }
}

const PostBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {posts} = useTypedSelector(state => state.postReducer)
    const {fetchPostList} = useActions()

    // Если в store нет должностей, пробуем их загрузить и обновить текст в поле
    useEffect(() => {
        if (!posts.length) {
            updatePostListStore()
                .then(() => updateSelectedInfo())
                .catch((error) => {
                    console.error('Ошибка загрузки должностей в store', error)
                })
        } else {
            updateSelectedInfo()
        }
    }, [props.posts])

    useEffect(() => {
        updateSelectedInfo()
    }, [posts])

    // Обновление списка объектов недвижимости в store
    const updatePostListStore = async () => {
        await fetchPostList({active: [0, 1]})
    }

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupPostSelector(document.body, {
            exclude: props.excludePosts,
            multi: props.multi,
            selected: props.posts,
            onSelect: (value: number[]) => {
                props.onSelect(value, e)
            }
        }, {
            center: true
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

        if (props.posts && props.posts.length) {
            const firstPostId: number = props.posts[0]
            const postsNames: string[] = []
            const postFirstInfo = posts.find((post: IPost) => post.id === firstPostId)

            if (postFirstInfo) {
                tmpText += postFirstInfo.name
            }

            if (props.posts.length > 1) {
                tmpText += ` + ещё ${props.posts.length - 1}`
            }

            props.posts.map((id: number) => {
                const postInfo = posts.find((post: IPost) => post.id === id)
                if (postInfo) {
                    postsNames.push(postInfo.name)
                }
            })

            tmpTitle = postsNames.join('\n')
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

PostBox.defaultProps = defaultProps
PostBox.displayName = 'PostBox'

export default PostBox