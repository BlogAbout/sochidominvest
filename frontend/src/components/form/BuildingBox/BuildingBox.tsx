import React, {useEffect, useState} from 'react'
import {IBuilding} from '../../../@types/IBuilding'
import openPopupBuildingSelector from '../../popup/PopupBuildingSelector/PopupBuildingSelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    buildings?: number[]
    multi?: boolean
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'
    onlyRent?: boolean

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    buildings: [],
    multi: false,
    onlyRent: false,
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('BuildingBox onSelect', value, e)
    }
}

const BuildingBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {buildings} = useTypedSelector(state => state.buildingReducer)
    const {fetchBuildingList} = useActions()

    // Если в store нет объектов недвижимости, пробуем их загрузить и обновить текст в поле
    useEffect(() => {
        if (!buildings.length) {
            updateBuildingListStore()
                .then(() => updateSelectedInfo())
                .catch((error) => {
                    console.error('Ошибка загрузки объектов недвижимости в store', error)
                })
        } else {
            updateSelectedInfo()
        }
    }, [props.buildings])

    useEffect(() => {
        updateSelectedInfo()
    }, [buildings])

    // Обновление списка объектов недвижимости в store
    const updateBuildingListStore = async () => {
        await fetchBuildingList({active: [0, 1]})
    }

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupBuildingSelector(document.body, {
            multi: props.multi,
            selected: props.buildings,
            onlyRent: props.onlyRent,
            onSelect: (value: number[]) => {
                props.onSelect(value, e)
            }
        })
    }

    // Обработчик сброса выбора
    const resetHandler = (e: React.MouseEvent) => {
        props.onSelect([], e)
    }

    // Обновление отображаемого текста в поле по выбранному значению
    const updateSelectedInfo = () => {
        let tmpText = ''
        let tmpTitle = ''

        if (props.buildings && props.buildings.length) {
            const firstBuildingId: number = props.buildings[0]
            const buildingsNames: string[] = []
            const buildingFirstInfo = buildings.find((building: IBuilding) => building.id === firstBuildingId)

            if (buildingFirstInfo) {
                tmpText += buildingFirstInfo.name
            }

            if (props.buildings.length > 1) {
                tmpText += ` + ещё ${props.buildings.length - 1}`
            }

            props.buildings.map((id: number) => {
                const buildingInfo = buildings.find((building: IBuilding) => building.id === id)
                if (buildingInfo) {
                    buildingsNames.push(buildingInfo.name)
                }
            })

            tmpTitle = buildingsNames.join('\n')
        }

        setText(tmpText)
        setTitle(tmpTitle)
    }

    const {onSelect, ...otherProps} = props
    return (
        <Box {...otherProps}
             value={text}
             type='picker'
             title={otherProps.title || title}
             onChange={clickHandler.bind(this)}
             onClear={resetHandler.bind(this)}
             showSelect
        />
    )
}

BuildingBox.defaultProps = defaultProps
BuildingBox.displayName = 'BuildingBox'

export default BuildingBox