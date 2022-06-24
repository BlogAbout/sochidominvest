import React, {useEffect, useState} from 'react'
import QuestionService from '../../../api/QuestionService'
import {IFilterBase} from '../../../@types/IFilter'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Empty from '../../../components/Empty/Empty'
import openPopupQuestionInfo from '../../../components/popup/PopupQuestionInfo/PopupQuestionInfo'
import {IQuestion} from '../../../@types/IQuestion'
import {compareText} from '../../../helpers/filterHelper'
import classes from './FaqPage.module.scss'

const FaqPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [questions, setQuestions] = useState<IQuestion[]>()
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])
    const [selectedType, setSelectedType] = useState<string>('all')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (isUpdate) {
            setFetching(true)

            QuestionService.fetchQuestions({active: [1]})
                .then((response: any) => {
                    setQuestions(response.data)
                })
                .catch((error: any) => {
                    console.error('Произошла ошибка загрузки данных', error)
                })
                .finally(() => {
                    setFetching(false)
                    setIsUpdate(false)
                })
        }
    }, [isUpdate])

    useEffect(() => {
        onFiltrationQuestions()
    }, [questions, searchText, selectedType])

    const onFiltrationQuestions = () => {
        const resultSearch = search(searchText)

        if (!resultSearch || !resultSearch.length) {
            setFilterQuestion([])
        } else if (!selectedType || selectedType === 'all') {
            setFilterQuestion(resultSearch)
        } else {
            setFilterQuestion(resultSearch.filter((question: IQuestion) => question.type === selectedType))
        }
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!questions || !questions.length) {
            return []
        }

        if (value !== '') {
            return questions.filter((question: IQuestion) => {
                return compareText(question.name, value) || compareText(question.description, value)
            })
        } else {
            return questions
        }
    }

    const onClickHandler = (question: IQuestion) => {
        openPopupQuestionInfo(document.body, {
            question: question
        })
    }

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'all',
            title: 'Все',
            icon: 'bookmark',
            active: selectedType.includes('all'),
            onClick: () => setSelectedType('all')
        },
        {
            key: 'common',
            title: 'Общие',
            icon: 'bolt',
            active: selectedType.includes('common'),
            onClick: () => setSelectedType('common')
        },
        {
            key: 'payment',
            title: 'Оплата',
            icon: 'money-bill-1-wave',
            active: selectedType.includes('payment'),
            onClick: () => setSelectedType('payment')
        },
        {
            key: 'tariffs',
            title: 'Тарифы',
            icon: 'money-check',
            active: selectedType.includes('tariffs'),
            onClick: () => setSelectedType('tariffs')
        },
        {
            key: 'other',
            title: 'Другое',
            icon: 'star',
            active: selectedType.includes('other'),
            onClick: () => setSelectedType('other')
        }
    ]

    return (
        <main className={classes.FaqPage}>
            <PageInfo title='F.A.Q.'/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}>F.A.Q.</Title>

                <div className={classes.container}>
                    <div className={classes.block}>
                        {filterQuestion && filterQuestion.length ?
                            filterQuestion.map((question: IQuestion) => {
                                return (
                                    <div key={question.id}
                                         className={classes.item}
                                         onClick={() => onClickHandler(question)}
                                    >{question.name}</div>
                                )
                            })
                            : <Empty message='Нет вопросов и ответов.'/>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

FaqPage.displayName = 'FaqPage'

export default FaqPage