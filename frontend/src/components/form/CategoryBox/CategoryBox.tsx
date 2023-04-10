import React, {useEffect, useState} from 'react'
import {ICategory} from '../../../@types/IStore'
import openPopupCategorySelector from '../../popup/PopupCategorySelector/PopupCategorySelector'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import Box from '../Box/Box'

interface Props {
    categories?: number[]
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
    onlyRent?: boolean

    onSelect(value: number[], e: React.MouseEvent): void
}

const defaultProps: Props = {
    categories: [],
    multi: false,
    onlyRent: false,
    onSelect: (value: number[], e: React.MouseEvent) => {
        console.info('CategoryBox onSelect', value, e)
    }
}

const CategoryBox: React.FC<Props> = (props) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const {categories} = useTypedSelector(state => state.storeReducer)
    const {fetchCategoryList} = useActions()

    // Если в store нет категорий товаров, пробуем их загрузить и обновить текст в поле
    useEffect(() => {
        if (!categories.length) {
            updateCategoryListStore()
                .then(() => updateSelectedInfo())
                .catch((error) => {
                    console.error('Ошибка загрузки категорий товаров в store', error)
                })
        }
    }, [])

    useEffect(() => {
        updateSelectedInfo()
    }, [categories, props.categories])

    // Обновление списка категорий товаров в store
    const updateCategoryListStore = async () => {
        await fetchCategoryList({active: [0, 1]})
    }

    // Обработчик клика на поле
    const clickHandler = (e: React.MouseEvent) => {
        openPopupCategorySelector(document.body, {
            multi: props.multi,
            selected: props.categories,
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

        if (props.categories && props.categories.length) {
            const firstCategoryId: number = props.categories[0]
            const categoriesNames: string[] = []
            const categoryFirstInfo = categories.find((category: ICategory) => category.id === firstCategoryId)

            if (categoryFirstInfo) {
                tmpText += categoryFirstInfo.name
            }

            if (props.categories.length > 1) {
                tmpText += ` + ещё ${props.categories.length - 1}`
            }

            props.categories.map((id: number) => {
                const categoryInfo = categories.find((category: ICategory) => category.id === id)
                if (categoryInfo) {
                    categoriesNames.push(categoryInfo.name)
                }
            })

            tmpTitle = categoriesNames.join('\n')
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

CategoryBox.defaultProps = defaultProps
CategoryBox.displayName = 'CategoryBox'

export default CategoryBox