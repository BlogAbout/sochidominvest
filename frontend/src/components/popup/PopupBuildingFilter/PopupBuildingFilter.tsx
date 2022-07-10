import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import CheckBox from '../../form/CheckBox/CheckBox'
import ComboBox from '../../ComboBox/ComboBox'
import Title from '../../ui/Title/Title'
import SelectorBox from '../../SelectorBox/SelectorBox'
import Label from '../../form/Label/Label'
import NumberBox from '../../NumberBox/NumberBox'
import DistrictBox from '../../form/DistrictBox/DistrictBox'
import {
    buildingClasses,
    buildingElectricity,
    buildingEntrance,
    buildingFormat,
    buildingGas,
    buildingHeating,
    buildingMaterials,
    buildingParking,
    buildingSewerage,
    buildingTerritory,
    buildingTypes,
    buildingWaterSupply
} from '../../../helpers/buildingHelper'
import {IFilterContent, IFilterParams} from '../../../@types/IFilter'
import {ISelector} from '../../../@types/ISelector'
import classes from './PopupBuildingFilter.module.scss'

interface Props extends PopupProps {
    filters: any

    onChange(filters: IFilterParams): void
}

const defaultProps: Props = {
    filters: null,
    onChange: (filters: IFilterParams) => {
        console.info('PopupBuildingFilter onChange', filters)
    }
}

const PopupBuildingFilter: React.FC<Props> = (props) => {
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

    const [filters, setFilters] = useState<any>(props.filters || initState)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const onChangeHandler = () => {
        props.onChange(filters)
        close()
    }

    const filtersContent: IFilterContent[] = [
        {
            title: 'Стоимость',
            type: 'ranger',
            rangerParams: {
                suffix: 'руб.',
                step: 1,
                max: 999999999,
                afterComma: 0
            },
            multi: false,
            selected: filters.buildingCost,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingCost: values})
            }
        },
        {
            title: 'Площадь',
            type: 'ranger',
            rangerParams: {
                suffix: 'м2.',
                step: 0.01,
                max: 999,
                afterComma: 2
            },
            multi: false,
            selected: filters.buildingArea,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingArea: values})
            }
        },
        {
            title: 'Район',
            type: 'district',
            multi: true,
            selected: filters.buildingDistrictZone,
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingDistrictZone: values})
            }
        },
        {
            title: 'Тип недвижимости',
            type: 'checker',
            multi: true,
            items: buildingTypes,
            selected: filters.buildingType || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, buildingType: values})
            }
        },
        {
            title: 'Класс дома',
            type: 'checker',
            multi: true,
            items: buildingClasses,
            selected: filters.houseClass || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, houseClass: values})
            }
        },
        {
            title: 'Материал здания',
            type: 'checker',
            multi: true,
            items: buildingMaterials,
            selected: filters.material || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, material: values})
            }
        },
        {
            title: 'Тип дома',
            type: 'checker',
            multi: true,
            items: buildingFormat,
            selected: filters.houseType || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, houseType: values})
            }
        },
        {
            title: 'Территория',
            type: 'checker',
            multi: true,
            items: buildingEntrance,
            selected: filters.entranceHouse || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, entranceHouse: values})
            }
        },
        {
            title: 'Паркинг',
            type: 'checker',
            multi: true,
            items: buildingParking,
            selected: filters.parking || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, parking: values})
            }
        },
        {
            title: 'Подъезд к дому',
            type: 'checker',
            multi: true,
            items: buildingTerritory,
            selected: filters.territory || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, territory: values})
            }
        },
        {
            title: 'Газ',
            type: 'checker',
            multi: true,
            items: buildingGas,
            selected: filters.gas || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, gas: values})
            }
        },
        {
            title: 'Отопление',
            type: 'checker',
            multi: true,
            items: buildingHeating,
            selected: filters.heating || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, heating: values})
            }
        },
        {
            title: 'Электричество',
            type: 'checker',
            multi: true,
            items: buildingElectricity,
            selected: filters.electricity || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, electricity: values})
            }
        },
        {
            title: 'Канализация',
            type: 'checker',
            multi: true,
            items: buildingSewerage,
            selected: filters.sewerage || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, sewerage: values})
            }
        },
        {
            title: 'Водоснабжение',
            type: 'checker',
            multi: true,
            items: buildingWaterSupply,
            selected: filters.waterSupply || [],
            onSelect: (values: string[]) => {
                setFilters({...filters, waterSupply: values})
            }
        }
    ]

    const renderSelectorItem = (filter: IFilterContent) => {
        if (filter.multi) {
            return (
                <ComboBox selected={filter.selected.length ? filter.selected[0] : null}
                          items={filter.items ? Object.values(filter.items) : []}
                          onSelect={(value: string) => filter.onSelect([value])}
                          placeHolder='Выберите'
                          styleType='standard'
                />
            )
        } else {
            return (
                <SelectorBox selected={filter.selected}
                             items={filter.items ? Object.values(filter.items) : []}
                             onSelect={(value: string[]) => filter.onSelect(value)}
                             placeHolder='Выберите'
                             multi
                             styleType='standard'
                />
            )
        }
    }

    const renderCheckerItem = (filter: IFilterContent) => {
        const selectItemHandler = (value: string) => {
            if (filter.selected.includes(value)) {
                return filter.selected.filter((item: string) => item !== value)
            } else {
                return [...filter.selected, value]
            }
        }

        return (
            <div className={classes.checkItems}>
                {filter.items ?
                    filter.items.map((item: ISelector, index: number) => {
                        return (
                            <CheckBox key={index}
                                      label={item.text}
                                      type='classic'
                                      checked={filter.selected.includes(item.key)}
                                      onChange={() => filter.onSelect(selectItemHandler(item.key))}
                            />
                        )
                    })
                    : null
                }
            </div>
        )
    }

    const renderRangerItem = (filter: IFilterContent) => {
        return (
            <div className={classes.rangeItem}>
                <div className={classes.col}>
                    <Label
                        text={filter.rangerParams && filter.rangerParams.suffix ? `От, ${filter.rangerParams.suffix}` : 'От'}
                    />
                    <NumberBox value={filter.selected && filter.selected.min ? filter.selected.min : ''}
                               min={0}
                               step={filter.rangerParams ? filter.rangerParams.step : undefined}
                               max={filter.rangerParams ? filter.rangerParams.max : undefined}
                               countAfterComma={filter.rangerParams ? filter.rangerParams.afterComma : undefined}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   filter.onSelect({...filter.selected, min: value})
                               }}
                               placeHolder={filter.rangerParams && filter.rangerParams.suffix ? `От, ${filter.rangerParams.suffix}` : 'От'}
                    />
                </div>

                <div className={classes.col}>
                    <Label
                        text={filter.rangerParams && filter.rangerParams.suffix ? `До, ${filter.rangerParams.suffix}` : 'До'}
                    />
                    <NumberBox value={filter.selected && filter.selected.max ? filter.selected.max : ''}
                               min={0}
                               step={filter.rangerParams ? filter.rangerParams.step : undefined}
                               max={filter.rangerParams ? filter.rangerParams.max : undefined}
                               countAfterComma={filter.rangerParams ? filter.rangerParams.afterComma : undefined}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>, value: number) => {
                                   filter.onSelect({...filter.selected, max: value})
                               }}
                               placeHolder={filter.rangerParams && filter.rangerParams.suffix ? `До, ${filter.rangerParams.suffix}` : 'До'}
                    />
                </div>
            </div>
        )
    }

    const renderDistrictItem = (filter: IFilterContent) => {
        return (
            <div className={classes.fieldItem}>
                <DistrictBox selected={filter.selected}
                             onSelect={(selected: string[]) => {
                                 filter.onSelect(selected)
                             }}
                             placeHolder={filter.title}
                             showClear
                />
            </div>
        )
    }

    const renderFilterItemByType = (filter: IFilterContent) => {
        switch (filter.type) {
            case 'selector':
                return renderSelectorItem(filter)
            case 'checker':
                return renderCheckerItem(filter)
            case 'ranger':
                return renderRangerItem(filter)
            case 'district':
                return renderDistrictItem(filter)
        }
    }

    const renderFilterItem = (filter: IFilterContent, index: number) => {
        return (
            <div key={index} className={classes.field}>
                <h3>{filter.title}</h3>

                {renderFilterItemByType(filter)}
            </div>
        )
    }

    return (
        <Popup className={classes.PopupBuildingFilter}>
            <BlockingElement fetching={false} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={2}>Фильтр</Title>

                    {filtersContent.map((filter: IFilterContent, index: number) => renderFilterItem(filter, index))}
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='magnifying-glass'
                        onClick={() => onChangeHandler()}
                        title='Найти'
                >Найти</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={() => setFilters(initState)}
                        className='marginLeft'
                        title='Сбросить'
                >Сбросить</Button>

                <Button type='regular'
                        icon='xmark'
                        onClick={() => close()}
                        className='marginLeft'
                        title='Закрыть'
                />
            </Footer>
        </Popup>
    )
}

PopupBuildingFilter.defaultProps = defaultProps
PopupBuildingFilter.displayName = 'PopupBuildingFilter'

export default function openPopupBuildingFilter(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupBuildingFilter, popupProps, undefined, block, displayOptions)
}