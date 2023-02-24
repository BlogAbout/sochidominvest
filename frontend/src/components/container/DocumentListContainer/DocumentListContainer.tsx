import React from 'react'
import {IDocument} from '../../../@types/IDocument'
import Empty from '../../ui/Empty/Empty'
import DocumentList from './components/DocumentList/DocumentList'
import DocumentTill from './components/DocumentTill/DocumentTill'
import classes from './DocumentListContainer.module.scss'

interface Props {
    documents: IDocument[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(document: IDocument): void

    onEdit(document: IDocument): void

    onRemove(document: IDocument): void

    onContextMenu(e: React.MouseEvent, document: IDocument): void
}

const defaultProps: Props = {
    documents: [],
    fetching: false,
    layout: 'list',
    onClick: (document: IDocument) => {
        console.info('DocumentListContainer onClick', document)
    },
    onEdit: (document: IDocument) => {
        console.info('DocumentListContainer onEdit', document)
    },
    onRemove: (document: IDocument) => {
        console.info('DocumentListContainer onRemove', document)
    },
    onContextMenu: (e: React.MouseEvent, document: IDocument) => {
        console.info('DocumentListContainer onContextMenu', e, document)
    }
}

const DocumentListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <DocumentList documents={props.documents}
                                  fetching={props.fetching}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <DocumentTill documents={props.documents}
                                  fetching={props.fetching}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onContextMenu={props.onContextMenu}
                    />
                )
        }
    }

    return (
        <div className={classes.DocumentListContainer}>
            {props.documents.length ? renderList() : <Empty message='Нет документов'/>}
        </div>
    )
}

DocumentListContainer.defaultProps = defaultProps
DocumentListContainer.displayName = 'DocumentListContainer'

export default DocumentListContainer