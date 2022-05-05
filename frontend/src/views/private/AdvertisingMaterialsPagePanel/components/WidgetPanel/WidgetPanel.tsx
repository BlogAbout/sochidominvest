import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import WidgetList from '../../../../../components/WidgetList/WidgetList'
import Button from '../../../../../components/Button/Button'
import classes from './WidgetPanel.module.scss'

const WidgetPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {buildings, fetching: fetchingBuildings} = useTypedSelector(state => state.buildingReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {partners, fetching: fetchingPartners} = useTypedSelector(state => state.partnerReducer)
    const {widgets, fetching: fetchingWidgets} = useTypedSelector(state => state.widgetReducer)
    const {fetchBuildingList, fetchArticleList, fetchWidgetList, fetchPartnerList} = useActions()

    useEffect(() => {
        if (isUpdate || !widgets.length) {
            fetchWidgetList({active: [0, 1]})
        }

        if (!buildings.length) {
            fetchBuildingList({active: [0, 1]})
        }

        if (!articles.length) {
            fetchArticleList({active: [0, 1]})
        }

        if (!partners.length) {
            fetchPartnerList({active: [0, 1]})
        }

        setIsUpdate(false)
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const addHandler = () => {
        // Todo
    }

    return (
        <main className={classes.WidgetPanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Виджеты - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Виджеты</span>
                    <Button type='apply' icon='plus' onClick={addHandler.bind(this)}>Добавить</Button>
                </h1>

                <WidgetList widgets={widgets}
                            fetching={fetchingBuildings || fetchingArticles || fetchingWidgets || fetchingPartners}
                            onSave={onSave.bind(this)}
                />
            </div>
        </main>
    )
}

WidgetPanel.displayName = 'WidgetPanel'

export default WidgetPanel