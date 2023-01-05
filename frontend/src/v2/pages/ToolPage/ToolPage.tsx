import React from 'react'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import classes from './ToolPage.module.scss'

const ToolPage: React.FC = (): React.ReactElement => {
    return (
        <PanelView pageTitle='Инструменты'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Инструменты</Title>

                <p style={{color: '#fff'}}>Раздел находится в стадии разработки. Приносим свои извинения!</p>
            </Wrapper>
        </PanelView>
    )
}

ToolPage.displayName = 'ToolPage'

export default React.memo(ToolPage)