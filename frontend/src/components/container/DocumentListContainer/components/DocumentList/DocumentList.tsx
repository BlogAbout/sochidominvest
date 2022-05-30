import React from 'react'
import DocumentItem from './components/DocumentItem/DocumentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IDocument} from '../../../../../@types/IDocument'
import classes from './DocumentList.module.scss'

interface Props {
    documents: IDocument[]
    fetching: boolean

    onClick(document: IDocument): void

    onEdit(document: IDocument): void

    onRemove(document: IDocument): void

    onContextMenu(e: React.MouseEvent, document: IDocument): void
}

const defaultProps: Props = {
    documents: [],
    fetching: false,
    onClick: (document: IDocument) => {
        console.info('DocumentList onClick', document)
    },
    onEdit: (document: IDocument) => {
        console.info('DocumentList onEdit', document)
    },
    onRemove: (document: IDocument) => {
        console.info('DocumentList onRemove', document)
    },
    onContextMenu: (e: React.MouseEvent, document: IDocument) => {
        console.info('DocumentList onContextMenu', e, document)
    }
}

const DocumentList: React.FC<Props> = (props) => {
    return (
        <div className={classes.DocumentList}>
            <div className={classes.head}>
                <div className={classes.name}>Название</div>
                <div className={classes.object}>Объект</div>
                <div className={classes.type}>Тип</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.documents.map((document: IDocument) => {
                    return (
                        <DocumentItem key={document.id}
                                      document={document}
                                      onClick={props.onClick}
                                      onEdit={props.onEdit}
                                      onRemove={props.onRemove}
                                      onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

DocumentList.defaultProps = defaultProps
DocumentList.displayName = 'DocumentList'

export default DocumentList