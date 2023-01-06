import React, {useEffect, useState} from 'react'
import {ICompilation} from '../../../@types/ICompilation'
import {compareText} from '../../../helpers/filterHelper'
import CompilationService from '../../../api/CompilationService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import CompilationList from './components/CompilationList/CompilationList'
import openPopupCompilationCreate from '../../../components/PopupCompilationCreate/PopupCompilationCreate'
import classes from './CompilationsPage.module.scss'

const CompilationsPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [compilations, setCompilations] = useState<ICompilation[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterCompilation, setFilterCompilation] = useState<ICompilation[]>([])

    useEffect(() => {
        fetchCompilationsHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [compilations])

    const fetchCompilationsHandler = () => {
        setFetching(true)

        CompilationService.fetchCompilations()
            .then((response: any) => {
                setCompilations(response.data)
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
        fetchCompilationsHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!compilations || !compilations.length) {
            setFilterCompilation([])
        }

        if (value !== '') {
            setFilterCompilation(compilations.filter((compilation: ICompilation) => {
                return compareText(compilation.name, value) || compareText(compilation.description, value)
            }))
        } else {
            setFilterCompilation(compilations)
        }
    }

    const onAddHandler = () => {
        openPopupCompilationCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    return (
        <PanelView pageTitle='Подборки'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Подборки</Title>

                <CompilationList list={filterCompilation} fetching={fetching}
                                 onSave={() => fetchCompilationsHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

CompilationsPage.displayName = 'CompilationsPage'

export default React.memo(CompilationsPage)