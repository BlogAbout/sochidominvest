import React from 'react'
import {IQuestion} from '../../../@types/IQuestion'
import Empty from '../../ui/Empty/Empty'
import QuestionList from './components/QuestionList/QuestionList'
import classes from './QuestionListContainer.module.scss'

interface Props {
    questions: IQuestion[]
    fetching: boolean

    onClick(question: IQuestion): void

    onEdit(question: IQuestion): void

    onRemove(question: IQuestion): void

    onContextMenu(e: React.MouseEvent, question: IQuestion): void
}

const defaultProps: Props = {
    questions: [],
    fetching: false,
    onClick: (question: IQuestion) => {
        console.info('QuestionListContainer onClick', question)
    },
    onEdit: (question: IQuestion) => {
        console.info('QuestionListContainer onEdit', question)
    },
    onRemove: (question: IQuestion) => {
        console.info('QuestionListContainer onRemove', question)
    },
    onContextMenu: (e: React.MouseEvent, question: IQuestion) => {
        console.info('QuestionListContainer onContextMenu', e, question)
    }
}

const QuestionListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.QuestionListContainer}>
            {props.questions.length ?
                <QuestionList questions={props.questions}
                              fetching={props.fetching}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onRemove={props.onRemove}
                              onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет вопросов'/>
            }
        </div>
    )
}

QuestionListContainer.defaultProps = defaultProps
QuestionListContainer.displayName = 'QuestionListContainer'

export default QuestionListContainer