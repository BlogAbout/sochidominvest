import React from 'react'
import Empty from '../Empty/Empty'
import DocumentItem from './components/DocumentItem/DocumentItem'
import {IDocument} from '../../@types/IDocument'
import classes from './DocumentList.module.scss'

interface Props {
    documents: IDocument[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    documents: [],
    fetching: false,
    onSave: () => {
        console.info('DocumentList onSave')
    }
}

const DocumentList: React.FC<Props> = (props) => {
    return (
        <div className={classes.DocumentList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Название</div>
                <div className={classes.object}>Объект</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.extension}>Расширение</div>
            </div>

            {props.documents.length ?
                props.documents.map((document: IDocument) => {
                    return (
                        <DocumentItem key={document.id} document={document} onSave={props.onSave.bind(this)}/>
                    )
                })
                : <Empty message='Нет документов'/>
            }
        </div>
    )
}

DocumentList.defaultProps = defaultProps
DocumentList.displayName = 'DocumentList'

export default DocumentList