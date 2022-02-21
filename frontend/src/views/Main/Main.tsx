import React from 'react'
import HeadPanel from './components/HeadPanel/HeadPanel'
import SectionLogin from './components/SectionLogin/SectionLogin'
import SectionInfo from './components/SectionInfo/SectionInfo'
import FooterDefault from '../../components/FooterDefault/FooterDefault'
import SectionAdvanced from './components/SectionAdvanced/SectionAdvanced'
import classes from './Main.module.scss'

const Main: React.FC = () => {
    return (
        <div className={classes.Main}>
            <main className={classes.Content}>
                <HeadPanel/>

                <SectionLogin/>

                <SectionInfo/>

                <SectionAdvanced/>

                <FooterDefault/>
            </main>
        </div>
    )
}

export default Main