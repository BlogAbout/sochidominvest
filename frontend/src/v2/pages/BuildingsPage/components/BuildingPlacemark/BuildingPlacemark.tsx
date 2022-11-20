import React from 'react'
import {Placemark} from 'react-yandex-maps'
import {configuration} from '../../../../../helpers/utilHelper'
import {IBuilding} from '../../../../../@types/IBuilding'
import openPopupBuildingInfo from '../../../../../components/popup/PopupBuildingInfo/PopupBuildingInfo'

interface Props {
    building: IBuilding

    onClick(): void
}

const defaultProps: Props = {
    building: {} as IBuilding,
    onClick: () => {
        console.info('BuildingPlacemark onClick')
    }
}

const BuildingPlacemark: React.FC<Props> = (props): React.ReactElement | null => {
    if (!props.building.coordinates) {
        return null
    }

    const coordinates = props.building.coordinates.split(',').map(Number)
    if (!coordinates || !coordinates.length || coordinates.length !== 2) {
        return null
    }

    const presetIcon = configuration.apiYandexMapIcon

    return (
        <Placemark key={props.building.id}
                   geometry={coordinates}
                   options={{
                       preset: presetIcon
                   }}
                   onClick={() => {
                       openPopupBuildingInfo(document.body, {
                           building: props.building,
                           onClick: () => props.onClick()
                       })
                   }}
        />
    )
}

BuildingPlacemark.defaultProps = defaultProps
BuildingPlacemark.displayName = 'BuildingPlacemark'

export default React.memo(BuildingPlacemark)