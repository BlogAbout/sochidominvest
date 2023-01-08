import React, {useEffect, useState} from 'react'
import {IBusinessProcess} from '../../../@types/IBusinessProcess'
import BusinessProcessService from '../../../api/BusinessProcessService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import BusinessProcessList from './components/BusinessProcessList/BusinessProcessList'
import openPopupBusinessProcessCreate
    from '../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import classes from './BusinessProcessPage.module.scss'

const BusinessProcessPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [businessProcesses, setBusinessProcesses] = useState<IBusinessProcess[]>([])
    const [ordering, setOrdering] = useState<number[]>([])

    useEffect(() => {
        fetchBusinessProcessesHandler()
    }, [])

    const fetchBusinessProcessesHandler = () => {
        setFetching(true)

        BusinessProcessService.fetchBusinessProcesses({active: [0, 1]})
            .then((response: any) => {
                setBusinessProcesses(response.data.list)
                setOrdering(response.data.ordering)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => setFetching(false))
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchBusinessProcessesHandler()
    }

    const onAddHandler = () => {
        openPopupBusinessProcessCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    return (
        <PanelView pageTitle='Бизнес-процессы'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       className={classes.title}
                >Бизнес-процессы</Title>

                <BusinessProcessList list={businessProcesses}
                                     ordering={ordering}
                                     fetching={fetching}
                                     onSave={() => fetchBusinessProcessesHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

BusinessProcessPage.displayName = 'BusinessProcessPage'

export default React.memo(BusinessProcessPage)