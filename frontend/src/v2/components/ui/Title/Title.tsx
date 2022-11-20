import React from 'react'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames/bind'
import SearchBox from '../../../../components/SearchBox/SearchBox'
import Button from '../../../../components/form/Button/Button'
import classes from './Title.module.scss'

interface ILayout {
    key: 'list' | 'till' | 'map'
    icon: IconProp
    marginLeft: boolean
    title: string
}

interface Props extends React.PropsWithChildren<any> {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    style?: 'left' | 'right' | 'center'
    className?: string
    activeLayout?: 'list' | 'till' | 'map'
    layouts?: ('list' | 'till' | 'map')[]
    searchText?: string

    onAdd?(e: React.MouseEvent): void

    onChangeLayout?(value: 'list' | 'till' | 'map'): void

    onFilter?(): void

    onSearch?(value: string): void
}

const defaultProps: Props = {
    type: 'h1',
    style: 'left',
    activeLayout: 'list',
    layouts: [],
    searchText: ''
}

const cx = classNames.bind(classes)

const Title: React.FC<Props> = (props): React.ReactElement | null => {
    const layoutButtons: ILayout[] = [
        {
            key: 'map',
            icon: 'earth-asia',
            marginLeft: true,
            title: 'Карта местности'
        },
        {
            key: 'till',
            icon: 'grip',
            marginLeft: !!(props.layouts && !props.layouts.includes('map')),
            title: 'Подробное отображение'
        },
        {
            key: 'list',
            icon: 'list',
            marginLeft: false,
            title: 'Списочное отображение'
        }
    ]

    const renderH1 = () => {
        return (
            <h1 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                <span>{props.children}</span>

                <div className={classes.interface}>
                    {props.onSearch ?
                        <div className={classes.search}>
                            <SearchBox value={props.searchText}
                                       onChange={(value: string) => props.onSearch ? props.onSearch(value) : undefined}
                            />
                        </div>
                        : null
                    }

                    {props.onFilter ?
                        <Button type='regular'
                                icon='sliders'
                                title='Фильтр'
                                className='marginLeft'
                                onClick={() => {
                                    if (props.onFilter) {
                                        props.onFilter()
                                    }
                                }}
                        />
                        : null
                    }

                    {props.layouts && props.layouts.length ?
                        <>
                            {layoutButtons.map((layout: ILayout) => {
                                if (!props.layouts || !props.layouts.includes(layout.key)) {
                                    return null
                                }

                                return (
                                    <Button type={props.activeLayout === layout.key ? 'regular' : 'save'}
                                            icon={layout.icon}
                                            onClick={() => props.onChangeLayout ? props.onChangeLayout(layout.key) : null}
                                            title={layout.title}
                                            className={layout.marginLeft ? 'marginLeft' : undefined}
                                    />
                                )
                            })}
                        </>
                        : null
                    }

                    {props.onAdd ?
                        <Button type='apply'
                                icon='plus'
                                onClick={(e: React.MouseEvent) => props.onAdd ? props.onAdd(e) : undefined}
                                className='marginLeft'
                        >Добавить</Button>
                        : null
                    }
                </div>
            </h1>
        )
    }

    const renderH2 = () => {
        return (
            <h2 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                <span>{props.children}</span>
            </h2>
        )
    }

    const renderH3 = () => {
        return (
            <h3 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                {props.children}
            </h3>
        )
    }

    const renderH4 = () => {
        return (
            <h4 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                {props.children}
            </h4>
        )
    }

    const renderH5 = () => {
        return (
            <h5 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                {props.children}
            </h5>
        )
    }

    const renderH6 = () => {
        return (
            <h6 className={cx(props.className, {'Title': true, [props.style || 'left']: true})}>
                {props.children}
            </h6>
        )
    }

    const renderTitleByType = () => {
        switch (props.type) {
            case 'h1':
                return renderH1()
            case 'h2':
                return renderH2()
            case 'h3':
                return renderH3()
            case 'h4':
                return renderH4()
            case 'h5':
                return renderH5()
            case 'h6':
                return renderH6()
            default:
                return null
        }
    }

    return renderTitleByType()
}

Title.defaultProps = defaultProps
Title.displayName = 'Title'

export default React.memo(Title)