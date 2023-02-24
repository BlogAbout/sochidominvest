import React, {useEffect, useState} from 'react'
import {ICompilation} from '../../../@types/ICompilation'
import openPopupCompilationSelector from '../../popup/PopupCompilationSelector/PopupCompilationSelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    compilations?: number[]
    excludeCompilations?: number[]
    multi?: boolean
    width?: number | string
    margin?: number | string
    flexGrow?: boolean,
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    errorText?: string
    showValidate?: boolean
    showRequired?: boolean
    showClear?: boolean
    disableTitle?: boolean
    styleType?: 'standard' | 'minimal' | 'borderDisabled'

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    compilations: [],
    excludeCompilations: [],
    multi: false,
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('CompilationBox onSelect', value, e)
    }
}

const CompilationBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {compilations} = useTypedSelector(state => state.compilationReducer)
    const {fetchCompilationList} = useActions()

    // Если в store нет подборок, пробуем их загрузить и обновить текст в поле
    useEffect(() => {
        if (!compilations.length) {
            updateCompilationListStore()
                .then(() => updateSelectedInfo())
                .catch((error) => {
                    console.error('Ошибка загрузки подборок в store', error)
                })
        } else {
            updateSelectedInfo()
        }
    }, [props.compilations])

    useEffect(() => {
        updateSelectedInfo()
    }, [compilations])

    // Обновление списка подборок в store
    const updateCompilationListStore = async () => {
        await fetchCompilationList()
    }

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupCompilationSelector(document.body, {
            exclude: props.excludeCompilations,
            multi: props.multi,
            selected: props.compilations,
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

        if (props.compilations && props.compilations.length) {
            const firstCompilationId: number = props.compilations[0]
            const compilationsNames: string[] = []
            const compilationFirstInfo = compilations.find((compilation: ICompilation) => compilation.id === firstCompilationId)

            if (compilationFirstInfo) {
                tmpText += compilationFirstInfo.name
            }

            if (props.compilations.length > 1) {
                tmpText += ` + ещё ${props.compilations.length - 1}`
            }

            props.compilations.map((id: number) => {
                const compilationInfo = compilations.find((compilation: ICompilation) => compilation.id === id)
                if (compilationInfo) {
                    compilationsNames.push(compilationInfo.name)
                }
            })

            tmpTitle = compilationsNames.join('\n')
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

CompilationBox.defaultProps = defaultProps
CompilationBox.displayName = 'CompilationBox'

export default CompilationBox