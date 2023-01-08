import React from 'react'
import QuestionItem from './components/QuestionItem/QuestionItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IQuestion} from '../../../../../@types/IQuestion'
import classes from './QuestionList.module.scss'

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
        console.info('MailingList onClick', question)
    },
    onEdit: (question: IQuestion) => {
        console.info('MailingList onEdit', question)
    },
    onRemove: (question: IQuestion) => {
        console.info('MailingList onRemove', question)
    },
    onContextMenu: (e: React.MouseEvent, question: IQuestion) => {
        console.info('MailingList onContextMenu', e, question)
    }
}

const QuestionList: React.FC<Props> = (props) => {
    return (
        <div className={classes.QuestionList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.author}>Автор</div>
                <div className={classes.type}>Тип</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.questions.map((question: IQuestion) => {
                    return (
                        <QuestionItem key={question.id}
                                      question={question}
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

QuestionList.defaultProps = defaultProps
QuestionList.displayName = 'QuestionList'

export default QuestionList