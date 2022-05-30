import React from 'react'
import DocumentItem from './components/DocumentItem/DocumentItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IDocument} from '../../../../../@types/IDocument'
import classes from './DocumentTill.module.scss'

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
        console.info('DocumentTill onClick', document)
    },
    onEdit: (document: IDocument) => {
        console.info('DocumentTill onEdit', document)
    },
    onRemove: (document: IDocument) => {
        console.info('DocumentTill onRemove', document)
    },
    onContextMenu: (e: React.MouseEvent, document: IDocument) => {
        console.info('DocumentTill onContextMenu', e, document)
    }
}

const DocumentTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.DocumentTill}>
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

DocumentTill.defaultProps = defaultProps
DocumentTill.displayName = 'DocumentTill'

export default DocumentTill