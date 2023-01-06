import React from 'react'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import classes from './ReportsPage.module.scss'

const ReportsPage: React.FC = (): React.ReactElement => {
    return (
        <PanelView pageTitle='Отчеты'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Отчеты</Title>

                <p style={{color: '#fff'}}>Раздел находится в стадии разработки. Приносим свои извинения!</p>
            </Wrapper>
        </PanelView>
    )
}

ReportsPage.displayName = 'ReportsPage'

export default React.memo(ReportsPage)