import React from 'react'
import classNames from 'classnames/bind'
import PageMetaInfo from '../../components/ui/PageMetaInfo/PageMetaInfo'
import Header from '../../components/ui/Header/Header'
import Footer from '../../components/ui/Footer/Footer'
import classes from './DefaultView.module.scss'

interface Props extends React.PropsWithChildren<any> {
    isMain?: boolean
    pageTitle?: string
    pageDescription?: string
}

const defaultProps: Props = {
    isMain: false
}

const cx = classNames.bind(classes)

const DefaultView: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className={cx({'DefaultView': true, isMain: props.isMain})}>
            <PageMetaInfo title={props.pageTitle || ''} description={props.pageDescription || ''}/>

            <Header/>

            <main className={classes.main}>
                {props.children}
            </main>

            <Footer/>
        </div>
    )
}

DefaultView.defaultProps = defaultProps
DefaultView.displayName = 'DefaultView'

export default React.memo(DefaultView)