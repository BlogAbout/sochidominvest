import React from 'react'
import {IPost} from '../../../@types/IPost'
import Empty from '../../ui/Empty/Empty'
import PostList from './components/PostList/PostList'
import classes from './PostListContainer.module.scss'

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
        console.info('PostListContainer onClick', post)
    },
    onEdit: (post: IPost) => {
        console.info('PostListContainer onEdit', post)
    },
    onRemove: (post: IPost) => {
        console.info('PostListContainer onRemove', post)
    },
    onContextMenu: (e: React.MouseEvent, post: IPost) => {
        console.info('PostListContainer onContextMenu', e, post)
    }
}

const PostListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.PostListContainer}>
            {props.posts.length ?
                <PostList posts={props.posts}
                              fetching={props.fetching}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onRemove={props.onRemove}
                              onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет должностей'/>
            }
        </div>
    )
}

PostListContainer.defaultProps = defaultProps
PostListContainer.displayName = 'PostListContainer'

export default PostListContainer