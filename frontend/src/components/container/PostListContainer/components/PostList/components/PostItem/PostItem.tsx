import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
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
    const renderArrowTree = () => {
        if (!props.post.hasChild) {
            return null
        }

        return (
            <span className={classes.arrow}>
                <FontAwesomeIcon icon={props.post.isOpen ? 'angle-up' : 'angle-down'}/>
            </span>
        )
    }

    return (
        <div className={cx({'PostItem': true, 'disabled': !props.post.active})}
             onClick={() => props.onClick(props.post)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.post)}
             style={{
                 marginLeft: props.post.spaces ? 30 * props.post.spaces : 0,
                 width: props.post.spaces ? (`calc(100% - ${30 * props.post.spaces}px`) : '100%'
             }}
        >
            <div className={classes.name}>
                {renderArrowTree()}
                {props.post.name}
            </div>
            <div className={classes.author}>{props.post.authorName || ''}</div>
            <div className={classes.type}>{getPostTypeText(props.post.type)}</div>
        </div>
    )
}

PostItem.defaultProps = defaultProps
PostItem.displayName = 'PostItem'

export default PostItem