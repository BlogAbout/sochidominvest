import React from 'react'
import classNames from 'classnames/bind'
import Button from '../../form/Button/Button'
import SearchBox from '../../SearchBox/SearchBox'
import classes from './Title.module.scss'

interface Props extends React.PropsWithChildren<any> {
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6
    activeLayout?: 'list' | 'till' | 'map'
    layouts?: ('list' | 'till' | 'map')[]
    valueSearch?: string
    addText?: string
    showAdd?: boolean
    showFilter?: boolean
    showSearch?: boolean

    onAdd?(e: React.MouseEvent): void

    onChangeLayout?(value: 'list' | 'till' | 'map'): void

    onFilter?(): void

    onSearch?(value: string): void
}

const defaultProps: Props = {
    type: 0,
    activeLayout: 'list',
    layouts: [],
    valueSearch: '',
    addText: 'Добавить',
    showAdd: false,
    showFilter: false,
    showSearch: false
}

const cx = classNames.bind(classes)

const Title: React.FC<Props> = (props) => {
    const renderElement = () => {
        switch (props.type) {
            case 0:
                return <div className={classes.custom}>{props.children}</div>
            case 1:
                return (
                    <h1 className={cx({'headTop': props.showSearch})}>
                        <span>{props.children}</span>

                        <div className={classes.interface}>
                            {props.showSearch ?
                                <div className={classes.search}>
                                    <SearchBox value={props.valueSearch}
                                               onChange={(value: string) => props.onSearch ? props.onSearch(value) : undefined}
                                    />
                                </div>
                                : null
                            }

                            {props.showFilter ?
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
                                : null}

                            {props.layouts && props.layouts.length ?
                                <>
                                    {props.layouts.includes('map') ?
                                        <Button type={props.activeLayout === 'map' ? 'regular' : 'save'}
                                                icon='earth-asia'
                                                onClick={() => props.onChangeLayout ? props.onChangeLayout('map') : null}
                                                title='Карта местности'
                                                className='marginLeft'
                                        />
                                        : null
                                    }

                                    {props.layouts.includes('till') ?
                                        <Button type={props.activeLayout === 'till' ? 'regular' : 'save'}
                                                icon='grip'
                                                onClick={() => props.onChangeLayout ? props.onChangeLayout('till') : null}
                                                title='Подробное отображение'
                                                className={!props.layouts.includes('map') ? 'marginLeft' : undefined}
                                        />
                                        : null
                                    }

                                    {props.layouts.includes('list') ?
                                        <Button type={props.activeLayout === 'list' ? 'regular' : 'save'}
                                                icon='list'
                                                onClick={() => props.onChangeLayout ? props.onChangeLayout('list') : null}
                                                title='Списочное отображение'
                                        />
                                        : null
                                    }
                                </>
                                : null}

                            {props.showAdd ?
                                <Button type='apply'
                                        icon='plus'
                                        onClick={(e: React.MouseEvent) => props.onAdd ? props.onAdd(e) : undefined}
                                        className='marginLeft'
                                >{props.addText}</Button>
                                : null
                            }
                        </div>
                    </h1>
                )
            case 2:
                return (
                    <h2>
                        <span>{props.children}</span>

                        {props.showAdd ?
                            <div className={classes.interface}>
                                <Button type='apply'
                                        icon='plus'
                                        onClick={(e: React.MouseEvent) => props.onAdd ? props.onAdd(e) : undefined}
                                        className='marginLeft'
                                >{props.addText}</Button>
                            </div>
                            : null
                        }
                    </h2>
                )
            case 3:
                return <h3>{props.children}</h3>
            case 4:
                return <h4>{props.children}</h4>
            case 5:
                return <h5>{props.children}</h5>
            case 6:
                return <h6>{props.children}</h6>
        }
    }

    return (
        <div className={classes.Title}>
            {renderElement()}
        </div>
    )
}

Title.defaultProps = defaultProps
Title.displayName = 'Title'

export default Title