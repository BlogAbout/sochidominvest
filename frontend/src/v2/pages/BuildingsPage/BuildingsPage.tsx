import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Map, MapState, YMaps, ZoomControl} from 'react-yandex-maps'
import {RouteNames} from '../../helpers/routerHelper'
import {IBuilding} from '../../../@types/IBuilding'
import {IFilter} from '../../../@types/IFilter'
import {ISelector} from '../../../@types/ISelector'
import {changeLayout, configuration, getLayout} from '../../../helpers/utilHelper'
import useInfiniteScroll from '../../../hooks/useInfiniteScroll'
import {compareText} from '../../../helpers/filterHelper'
import {
    checkBuildingByDistrict,
    checkBuildingByRangeArea,
    checkBuildingByRangeCost,
    districtList,
    getBuildingTypesText,
    getDistrictText,
    getPassedText
} from '../../../helpers/buildingHelper'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../components/ui/Empty/Empty'
import DefaultView from '../../views/DefaultView/DefaultView'
import BuildingService from '../../../api/BuildingService'
import BuildingPlacemark from './components/BuildingPlacemark/BuildingPlacemark'
import BlockItem from '../../components/ui/BlockItem/BlockItem'
import openPopupBuildingFilter from '../../../components/popup/PopupBuildingFilter/PopupBuildingFilter'
import classes from './BuildingsPage.module.scss'

interface Props {
    isRent?: boolean
}

const defaultProps: Props = {
    isRent: false
}

const BuildingsPage: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const refScrollerContainer = useRef(null)

    const initState: any = {
        buildingCost: {min: 0, max: 0},
        buildingArea: {min: 0, max: 0},
        buildingDistrictZone: [],
        buildingType: [],
        houseClass: [],
        material: [],
        houseType: [],
        entranceHouse: [],
        parking: [],
        territory: [],
        gas: [],
        heating: [],
        electricity: [],
        sewerage: [],
        waterSupply: []
    }

    const [filters, setFilters] = useState<any>(getFiltersInit())
    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [filterBuilding, setFilterBuilding] = useState<IBuilding[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [layout, setLayout] = useState<'list' | 'till' | 'map'>(getLayout('buildings') === 'list' ? 'till' : getLayout('buildings'))

    const countPerPage: number = useMemo(() => 18, [])
    const directoryUrl = useMemo(() => {
        return props.isRent ? RouteNames.RENT : RouteNames.BUILDING
    }, [props.isRent])

    const [readMoreElementRef] = useInfiniteScroll(
        currentPage * countPerPage < buildings.length
            ? () => setCurrentPage(currentPage + 1)
            : () => {
            },
        fetching
    )

    useEffect(() => {
        onFetchBuildings()
    }, [props.isRent])

    useEffect(() => {
        onFilterBuildingHandler(filters)
    }, [buildings, searchText])

    useEffect(() => {
        onScrollContainerTopHandler(refScrollerContainer)
    }, [countPerPage, filterBuilding, searchText])

    const mapState: MapState = {
        center: [55.76, 37.64],
        zoom: 10,
        controls: [],
        type: 'yandex#map'
    }

    // Получение значений фильтра с главной страницы либо первоначальное состояние
    function getFiltersInit() {
        const mainPageFilterStr = localStorage.getItem('mainPageFilter')

        if (mainPageFilterStr) {
            const mainPageFilter = JSON.parse(mainPageFilterStr)
            let district: any[] = []

            if (mainPageFilter.district) {
                const districtInfo = districtList.find((item: ISelector) => item.key === mainPageFilter.district)

                if (districtInfo && districtInfo.children) {
                    district = districtInfo.children.map((item: ISelector) => item.key)
                }
            }

            return {
                ...initState,
                buildingDistrictZone: district,
                buildingType: mainPageFilter.houseType ? [mainPageFilter.houseType] : [],
                houseClass: mainPageFilter.houseClass ? [mainPageFilter.houseClass] : [],
                buildingCost: {min: mainPageFilter.minCost || 0, max: mainPageFilter.maxCost || 0}
            }
        } else {
            return initState
        }
    }

    // Загрузка списка объектов недвижимости
    const onFetchBuildings = () => {
        setFetching(true)

        const filter: IFilter = {
            active: [1],
            publish: 1
        }

        if (props.isRent) {
            filter.rent = [1]
        }

        BuildingService.fetchBuildings(filter)
            .then((response: any) => {
                setBuildings(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Прокрутка страницы вверх и возвращение на первую страницу
    const onScrollContainerTopHandler = (refElement: React.MutableRefObject<any>) => {
        if (refElement && currentPage > 1) {
            if (refElement.current && refElement.current.scrollTop) {
                refElement.current.scrollTop = 0
            }

            setCurrentPage(1)
        }
    }

    // Изменение режима отображения
    const onChangeLayoutHandler = (value: 'list' | 'till' | 'map') => {
        setLayout(value)
        changeLayout('buildings', value)
    }

    // Фильтрация объектов недвижимости
    const onFilterBuildingHandler = (filtersParams: any) => {
        setFilters(filtersParams)

        if (!buildings || !buildings.length) {
            setFilterBuilding([])
        } else {
            const prepareBuildings: IBuilding[] = buildings.filter((item: IBuilding) => {
                return checkBuildingByRangeCost(item, filtersParams) &&
                    checkBuildingByRangeArea(item, filtersParams) &&
                    checkBuildingByDistrict(item, filtersParams) &&
                    ((!filtersParams.buildingType || !filtersParams.buildingType.length) || (filtersParams.buildingType && item.type && filtersParams.buildingType.includes(item.type))) &&
                    ((!filtersParams.houseClass || !filtersParams.houseClass.length) || (filtersParams.houseClass && item.houseClass && filtersParams.houseClass.includes(item.houseClass))) &&
                    ((!filtersParams.material || !filtersParams.material.length) || (filtersParams.material && item.material && filtersParams.material.includes(item.material))) &&
                    ((!filtersParams.houseType || !filtersParams.houseType.length) || (filtersParams.houseType && item.houseType && filtersParams.houseType.includes(item.houseType))) &&
                    ((!filtersParams.entranceHouse || !filtersParams.entranceHouse.length) || (filtersParams.entranceHouse && item.entranceHouse && filtersParams.entranceHouse.includes(item.entranceHouse))) &&
                    ((!filtersParams.parking || !filtersParams.parking.length) || (filtersParams.parking && item.parking && filtersParams.parking.includes(item.parking))) &&
                    ((!filtersParams.territory || !filtersParams.territory.length) || (filtersParams.territory && item.territory && filtersParams.territory.includes(item.territory))) &&
                    ((!filtersParams.gas || !filtersParams.gas.length) || (filtersParams.gas && item.gas && filtersParams.gas.includes(item.gas))) &&
                    ((!filtersParams.electricity || !filtersParams.electricity.length) || (filtersParams.electricity && item.electricity && filtersParams.electricity.includes(item.electricity))) &&
                    ((!filtersParams.sewerage || !filtersParams.sewerage.length) || (filtersParams.sewerage && item.sewerage && filtersParams.sewerage.includes(item.sewerage))) &&
                    ((!filtersParams.waterSupply || !filtersParams.waterSupply.length) || (filtersParams.waterSupply && item.waterSupply && filtersParams.waterSupply.includes(item.waterSupply))) &&
                    (searchText.trim() === '' || compareText(item.name, searchText) || (item.address && compareText(item.address, searchText)))
            })

            setFilterBuilding(prepareBuildings)
        }

        localStorage.removeItem('mainPageFilter')
    }

    // Отображение объектов недвижимости в режиме списка
    const renderTillContainer = (): React.ReactElement => {
        return (
            <BlockingElement fetching={fetching} className={classes.list}>
                {filterBuilding && filterBuilding.length ?
                    filterBuilding.map((building: IBuilding, index: number) => {
                        if (index >= currentPage * countPerPage) {
                            return null
                        }

                        return (
                            <BlockItem key={building.id}
                                       title={building.name}
                                       avatar={building.avatar || ''}
                                       address={building.address || ''}
                                       districtText={getDistrictText(building.district, building.districtZone)}
                                       date={building.dateCreated || undefined}
                                       type={getBuildingTypesText(building.type)}
                                       passed={getPassedText(building.passed)}
                                       isPassed={!!(building.passed && building.passed.is)}
                                       rentType={building.rentData ? building.rentData.type === 'short' ? '/в сутки' : '/в месяц' : undefined}
                                       rentCost={building.rentData && building.rentData.cost ? building.rentData.cost : undefined}
                                       countCheckers={building.countCheckers || undefined}
                                       buildingType={building.type}
                                       cost={building.type === 'building' ? (building.costMin || 0) : (building.cost || 0)}
                                       areaMin={building.type === 'building' ? (building.areaMin || 0) : (building.area || 0)}
                                       areaMax={building.type === 'building' ? (building.areaMax || 0) : undefined}
                                       isDisabled={!building.active}
                                       isRent={props.isRent}
                                       cadastrNumber={building.type === 'land' ? building.cadastrNumber : null}
                                       onContextMenu={() => {
                                       }}
                                       onClick={() => navigate(`${directoryUrl}/${building.id}`)}
                            />
                        )
                    })
                    : <Empty message='Нет объектов недвижимости'/>
                }

                {buildings.length && readMoreElementRef ?
                    <div className={classes.readMoreElementRef} ref={readMoreElementRef}/> : null}
            </BlockingElement>
        )
    }

    // Отображение объектов недвижимости в режиме карты
    const renderMapContainer = (): React.ReactElement => {
        return (
            <div className={classes.containerMap}>
                <div className={classes.map}>
                    {configuration.apiYandexMapKey ?
                        <YMaps enterprise
                               query={{
                                   apikey: configuration.apiYandexMapKey
                               }}
                        >
                            <Map state={mapState}
                                 width='100%'
                                 height='100%'
                                 modules={['ObjectManager', 'Placemark']}
                            >
                                <ZoomControl/>

                                {filterBuilding && filterBuilding.length ?
                                    filterBuilding.map((building: IBuilding) => {
                                        return (
                                            <BuildingPlacemark key={building.id}
                                                               building={building}
                                                               onClick={() => navigate(`${directoryUrl}/${building.id}`)}
                                            />
                                        )
                                    })
                                    : null
                                }
                            </Map>
                        </YMaps>
                        : <Empty message='API ключ для Yandex.Maps не указан. Карта не доступна!'/>
                    }
                </div>
            </div>
        )
    }

    return (
        <DefaultView pageTitle={props.isRent ? 'Аренда' : 'Недвижимость'}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h1'
                           style='center'
                           activeLayout={layout}
                           layouts={['till', 'map']}
                           onChangeLayout={onChangeLayoutHandler.bind(this)}
                           searchText={searchText}
                           onSearch={(value: string) => setSearchText(value)}
                           onFilter={() => {
                               openPopupBuildingFilter(document.body, {
                                   filters: filters,
                                   onChange: onFilterBuildingHandler.bind(this)
                               })
                           }}
                    >{props.isRent ? 'Аренда' : 'Недвижимость'}</Title>

                    {layout === 'till' ? renderTillContainer() : renderMapContainer()}
                </div>
            </Wrapper>
        </DefaultView>
    )
}

BuildingsPage.defaultProps = defaultProps
BuildingsPage.displayName = 'BuildingsPage'

export default BuildingsPage