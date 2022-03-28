import React from 'react'
import HeadPanel from './components/HeadPanel/HeadPanel'
import SectionInfo from './components/SectionInfo/SectionInfo'
import SectionAdvanced from './components/SectionAdvanced/SectionAdvanced'
import classes from './Main.module.scss'

const Main: React.FC = () => {
    return (
        <div className={classes.Main}>
            <main className={classes.Content}>
                <HeadPanel/>

                <SectionAdvanced/>

                <SectionInfo/>
            </main>
        </div>
    )
}

export default Main