import React from 'react'
import PostItem from './components/PostItem/PostItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IPost} from '../../../../../@types/IPost'
import classes from './PostList.module.scss'

interface Props {
    posts: IPost[]
    fetching: boolean

    onClick(post: IPost): void

    onEdit(post: IPost): void

    onRemove(post: IPost): void

    onContextMenu(e: React.MouseEvent, post: IPost): void
}

const defaultProps: Props = {
    posts: [],
    fetching: false,
    onClick: (post: IPost) => {
        console.info('PostList onClick', post)
    },
    onEdit: (post: IPost) => {
        console.info('PostList onEdit', post)
    },
    onRemove: (post: IPost) => {
        console.info('PostList onRemove', post)
    },
    onContextMenu: (e: React.MouseEvent, post: IPost) => {
        console.info('PostList onContextMenu', e, post)
    }
}

const PostList: React.FC<Props> = (props) => {
    return (
        <div className={classes.PostList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.posts.map((post: IPost) => {
                    return (
                        <PostItem key={post.id}
                                  post={post}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

PostList.defaultProps = defaultProps
PostList.displayName = 'PostList'

export default PostList