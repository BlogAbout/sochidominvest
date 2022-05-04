import React from 'react'
import Helmet from 'react-helmet'
import Button from '../../../../../components/Button/Button'
import classes from './WidgetPanel.module.scss'

const WidgetPanel: React.FC = () => {
    return (
        <main className={classes.WidgetPanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Виджеты - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Виджеты - 9 Мая</span>
                    <Button type='apply' icon='plus' onClick={() => console.log('todo')}>Добавить</Button>
                </h1>

                <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
            </div>
        </main>
    )
}

WidgetPanel.displayName = 'WidgetPanel'

export default WidgetPanel