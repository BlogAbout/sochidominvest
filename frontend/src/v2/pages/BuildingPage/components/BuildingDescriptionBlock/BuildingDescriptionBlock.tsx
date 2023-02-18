import React from 'react'
import {IBuilding} from '../../../../../@types/IBuilding'
import {converter} from '../../../../helpers/utilHelper'
import {getAboutBlockTitle} from '../../../../../helpers/buildingHelper'
import Title from '../../../../components/ui/Title/Title'
import classes from './BuildingDescriptionBlock.module.scss'

interface Props {
    building: IBuilding
}

const defaultProps: Props = {
    building: {} as IBuilding
}

const BuildingDescriptionBlock: React.FC<Props> = (props): React.ReactElement | null => {
    if (!props.building.description || props.building.description.trim() === '') {
        return null
    }

    return (
        <div className={classes.BuildingDescriptionBlock}>
            <Title type='h2'>{getAboutBlockTitle(props.building.type)}</Title>

            <div className={classes.text}
                 dangerouslySetInnerHTML={{__html: converter.makeHtml(props.building.description)}}
            />
        </div>
    )
}

BuildingDescriptionBlock.defaultProps = defaultProps
BuildingDescriptionBlock.displayName = 'BuildingDescriptionBlock'

export default BuildingDescriptionBlock