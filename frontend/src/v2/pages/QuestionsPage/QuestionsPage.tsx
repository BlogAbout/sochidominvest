import React, {useEffect, useMemo, useState} from 'react'
import {IFilterContent} from '../../../@types/IFilter'
import {IQuestion} from '../../../@types/IQuestion'
import {compareText} from '../../../helpers/filterHelper'
import {questionTypes} from '../../../helpers/questionHelper'
import QuestionService from '../../../api/QuestionService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import QuestionList from './components/QuestionList/QuestionList'
import openPopupQuestionCreate from '../../../components/popup/PopupQuestionCreate/PopupQuestionCreate'
import classes from './QuestionsPage.module.scss'

const QuestionsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [questions, setQuestions] = useState<IQuestion[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterQuestion, setFilterQuestion] = useState<IQuestion[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['common', 'payment', 'tariffs', 'other']
    })

    useEffect(() => {
        fetchQuestionsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [questions, filters])

    const fetchQuestionsHandler = () => {
        setFetching(true)

        QuestionService.fetchQuestions({active: [0, 1]})
            .then((response: any) => {
                setQuestions(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchQuestionsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!questions || !questions.length) {
            setFilterQuestion([])
        }

        if (value !== '') {
            setFilterQuestion(filterItemsHandler(questions.filter((question: IQuestion) => {
                return compareText(question.name, value) || compareText(question.description, value)
            })))
        } else {
            setFilterQuestion(filterItemsHandler(questions))
        }
    }

    const onAddHandler = () => {
        openPopupQuestionCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IQuestion[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IQuestion) => {
            return filters.types.includes(item.type)
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Тип',
                type: 'checker',
                multi: true,
                items: questionTypes,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            }
        ]
    }, [filters])

    return (
        <PanelView pageTitle='Вопросы и ответы'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Вопросы и ответы</Title>

                <QuestionList list={filterQuestion} fetching={fetching} onSave={() => fetchQuestionsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

QuestionsPage.displayName = 'QuestionsPage'

export default React.memo(QuestionsPage)