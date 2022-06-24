import React from 'react'
import classNames from 'classnames/bind'
import {IQuestion} from '../../../../../../../@types/IQuestion'
import {getQuestionTypeText} from '../../../../../../../helpers/questionHelper'
import classes from './QuestionItem.module.scss'

interface Props {
    question: IQuestion

    onClick(question: IQuestion): void

    onEdit(question: IQuestion): void

    onRemove(question: IQuestion): void

    onContextMenu(e: React.MouseEvent, question: IQuestion): void
}

const defaultProps: Props = {
    question: {} as IQuestion,
    onClick: (question: IQuestion) => {
        console.info('QuestionItem onClick', question)
    },
    onEdit: (question: IQuestion) => {
        console.info('QuestionItem onEdit', question)
    },
    onRemove: (question: IQuestion) => {
        console.info('QuestionItem onRemove', question)
    },
    onContextMenu: (e: React.MouseEvent, question: IQuestion) => {
        console.info('QuestionItem onContextMenu', e, question)
    }
}

const cx = classNames.bind(classes)

const QuestionItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'QuestionItem': true, 'disabled': !props.question.active})}
             onClick={() => props.onClick(props.question)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.question)}
        >
            <div className={classes.name}>{props.question.name}</div>
            <div className={classes.author}>{props.question.authorName || ''}</div>
            <div className={classes.type}>{getQuestionTypeText(props.question.type)}</div>
        </div>
    )
}

QuestionItem.defaultProps = defaultProps
QuestionItem.displayName = 'QuestionItem'

export default QuestionItem