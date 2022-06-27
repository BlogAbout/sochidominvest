import React from 'react'
import classNames from 'classnames/bind'
import {IPost} from '../../../../../../../@types/IPost'
import {getPostTypeText} from '../../../../../../../helpers/postHelper'
import classes from './PostItem.module.scss'

interface Props {
    post: IPost

    onClick(post: IPost): void

    onEdit(post: IPost): void

    onRemove(post: IPost): void

    onContextMenu(e: React.MouseEvent, post: IPost): void
}

const defaultProps: Props = {
    post: {} as IPost,
    onClick: (post: IPost) => {
        console.info('PostItem onClick', post)
    },
    onEdit: (post: IPost) => {
        console.info('PostItem onEdit', post)
    },
    onRemove: (post: IPost) => {
        console.info('PostItem onRemove', post)
    },
    onContextMenu: (e: React.MouseEvent, post: IPost) => {
        console.info('PostItem onContextMenu', e, post)
    }
}

const cx = classNames.bind(classes)

const PostItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'PostItem': true, 'disabled': !props.post.active})}
             onClick={() => props.onClick(props.post)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.post)}
        >
            <div className={classes.name}>{props.post.name}</div>
            <div className={classes.author}>{props.post.authorName || ''}</div>
            <div className={classes.type}>{getPostTypeText(props.post.type)}</div>
        </div>
    )
}

PostItem.defaultProps = defaultProps
PostItem.displayName = 'PostItem'

export default PostItem