import React, {useEffect} from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../../../hooks/useActions'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getDocumentTypeText} from '../../../../../../../helpers/documentHelper'
import {IDocument} from '../../../../../../../@types/IDocument'
import {IBuilding} from '../../../../../../../@types/IBuilding'
import Avatar from '../../../../../../ui/Avatar/Avatar'

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
    let objectTypeIcon: IconProp = 'building'

    if (props.document.objectType && props.document.objectId) {
        switch (props.document.objectType) {
            case 'building':
                if (buildings && buildings.length) {
                    const buildingInfo = buildings.find((building: IBuilding) => building.id === props.document.objectId)

                    if (buildingInfo) {
                        objectInfo = buildingInfo.name
                        objectTypeIcon = 'building'
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
            <Avatar href={props.document.avatar} alt={props.document.name} width={150} height={150}/>

            <div className={classes.itemContent}>
                <h2>{props.document.name}</h2>

                <div className={classes.row} title='Тип'>
                    <FontAwesomeIcon icon='star'/>
                    <span>{getDocumentTypeText(props.document.type)}</span>
                </div>

                {objectInfo ?
                    <div className={classes.row} title='Объект'>
                        <FontAwesomeIcon icon={objectTypeIcon}/>
                        <span>{objectInfo}</span>
                    </div>
                    : null}
            </div>
        </div>
    )
}

DocumentItem.defaultProps = defaultProps
DocumentItem.displayName = 'DocumentItem'

export default DocumentItem