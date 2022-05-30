import React, {useEffect} from 'react'
import classNames from 'classnames/bind'
import {IDocument} from '../../../../../../../@types/IDocument'
import {IBuilding} from '../../../../../../../@types/IBuilding'
import {getDocumentTypeText} from '../../../../../../../helpers/documentHelper'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../../../hooks/useActions'
import classes from './DocumentItem.module.scss'

interface Props {
    document: IDocument

    onClick(document: IDocument): void

    onEdit(document: IDocument): void

    onRemove(document: IDocument): void

    onContextMenu(e: React.MouseEvent, document: IDocument): void
}

const defaultProps: Props = {
    document: {} as IDocument,
    onClick: (document: IDocument) => {
        console.info('DocumentItem onClick', document)
    },
    onEdit: (document: IDocument) => {
        console.info('DocumentItem onEdit', document)
    },
    onRemove: (document: IDocument) => {
        console.info('DocumentItem onRemove', document)
    },
    onContextMenu: (e: React.MouseEvent, document: IDocument) => {
        console.info('DocumentItem onContextMenu', e, document)
    }
}

const cx = classNames.bind(classes)

const DocumentItem: React.FC<Props> = (props) => {
    const {buildings, fetching} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    useEffect(() => {
        if (props.document.id && (!buildings || !buildings.length)) {
            fetchBuildingList({active: [0, 1]})
        }
    }, [props.document])

    let objectInfo = ''

    if (props.document.objectType && props.document.objectId) {
        switch (props.document.objectType) {
            case 'building':
                if (buildings && buildings.length) {
                    const buildingInfo = buildings.find((building: IBuilding) => building.id === props.document.objectId)

                    if (buildingInfo) {
                        objectInfo = buildingInfo.name
                    }
                }
                break
        }
    }

    return (
        <div className={cx({'DocumentItem': true, 'disabled': !props.document.active})}
             onClick={() => props.onClick(props.document)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.document)}
        >
            <div className={classes.name}>{props.document.name}</div>
            <div className={classes.object}>{objectInfo}</div>
            <div className={classes.type}>{getDocumentTypeText(props.document.type)}</div>
        </div>
    )
}

DocumentItem.defaultProps = defaultProps
DocumentItem.displayName = 'DocumentItem'

export default DocumentItem