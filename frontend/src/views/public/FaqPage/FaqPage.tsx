import React, {useEffect, useState} from 'react'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Empty from '../../../components/Empty/Empty'
import {IQuestion} from '../../../@types/IQuestion'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import classes from './FaqPage.module.scss'

const FaqPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])

    const {questions, fetching} = useTypedSelector(state => state.questionReducer)
    const {fetchQuestionList} = useActions()

    useEffect(() => {
        if (isUpdate || !questions.length) {
            fetchQuestionList({active: [1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [questions])

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!questions || !questions.length) {
            setFilterQuestion([])
        }

        if (value !== '') {
            setFilterQuestion(questions.filter((question: IQuestion) => {
                return compareText(question.name, value) || compareText(question.description, value)
            }))
        } else {
            setFilterQuestion(questions)
        }
    }

    return (
        <main className={classes.AboutPage}>
            <PageInfo title='F.A.Q.'/>

            <FilterBase valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}>F.A.Q.</Title>

                <div className={classes.container}>
                    <div className={classes.block}>
                        <Empty message='Нет вопросов и ответов.'/>
                    </div>
                </div>
            </div>
        </main>
    )
}

FaqPage.displayName = 'FaqPage'

export default FaqPage