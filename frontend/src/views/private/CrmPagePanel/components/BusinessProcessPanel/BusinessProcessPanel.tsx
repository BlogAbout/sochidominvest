import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import FilterBase from '../../../../../components/ui/FilterBase/FilterBase'
import Title from '../../../../../components/ui/Title/Title'
import BusinessProcessListContainer
    from '../../../../../components/container/BusinessProcessContainer/BusinessProcessContainer'
import classes from './BusinessProcessPanel.module.scss'

const BusinessProcessPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterBusinessProcesses, setFilterBusinessProcesses] = useState<IBusinessProcess[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {businessProcesses, fetching} = useTypedSelector(state => state.businessProcessReducer)
    const {fetchBusinessProcessList} = useActions()

    useEffect(() => {
        if (isUpdate || !businessProcesses.length) {
            fetchBusinessProcessList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [businessProcesses])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!businessProcesses || !businessProcesses.length) {
            setFilterBusinessProcesses([])
        }

        if (value !== '') {
            // Todo
        } else {
            // Todo
        }
    }

    const onAddHandler = () => {
        // Todo
    }

    const onClickHandler = (businessProcess: IBusinessProcess) => {
        // Todo
    }

    const onEditHandler = (businessProcess: IBusinessProcess) => {

    }

    const onRemoveHandler = (businessProcess: IBusinessProcess) => {

    }

    const onContextMenu = (e: React.MouseEvent, businessProcess: IBusinessProcess) => {

    }

    return (
        <main className={classes.BusinessProcessPanel}>
            <PageInfo title='Бизнес-процессы'/>

            <FilterBase valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Бизнес-процессы</Title>

                <BusinessProcessListContainer businessProcesses={filterBusinessProcesses}
                                              fetching={fetching}
                                              onClick={onClickHandler.bind(this)}
                                              onEdit={onEditHandler.bind(this)}
                                              onRemove={onRemoveHandler.bind(this)}
                                              onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

BusinessProcessPanel.displayName = 'BusinessProcessPanel'

export default BusinessProcessPanel