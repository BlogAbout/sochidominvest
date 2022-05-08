import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {IPartner} from '../../../../../@types/IPartner'
import {compareText} from '../../../../../helpers/filterHelper'
import Button from '../../../../../components/form/Button/Button'
import SearchBox from '../../../../../components/SearchBox/SearchBox'
import PartnerList from '../../../../../components/PartnerList/PartnerList'
import openPopupPartnerCreate from '../../../../../components/PopupPartnerCreate/PopupPartnerCreate'
import classes from './PartnerPanel.module.scss'

const PartnerPanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterPartner, setFilterPartner] = useState<IPartner[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {partners, fetching} = useTypedSelector(state => state.partnerReducer)
    const {fetchPartnerList} = useActions()

    useEffect(() => {
        if (isUpdate || !partners.length) {
            fetchPartnerList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [partners, selectedType])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!partners || !partners.length) {
            setFilterPartner([])
        }

        if (value !== '') {
            setFilterPartner(partners.filter((partner: IPartner) => {
                return (!selectedType.length || selectedType.includes(partner.type)) && compareText(partner.name, value)
            }))
        } else {
            setFilterPartner(!selectedType.length ? partners : partners.filter((partner: IPartner) => selectedType.includes(partner.type)))
        }
    }

    const addHandler = () => {
        openPopupPartnerCreate(document.body, {
            onSave: () => onSave()
        })
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    return (
        <main className={classes.PartnerPanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Спонсоры и партнеры - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type={selectedType.includes('partner') ? 'regular' : 'save'}
                        icon='handshake-angle'
                        onClick={() => onClickFilterButtonHandler('partner')}
                >Партнеры</Button>

                <Button type={selectedType.includes('sponsor') ? 'regular' : 'save'}
                        icon='money-bill-1-wave'
                        onClick={() => onClickFilterButtonHandler('sponsor')}
                >Спонсоры</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Спонсоры и партнеры</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={addHandler.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <PartnerList partners={filterPartner} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

PartnerPanel.displayName = 'PartnerPanel'

export default PartnerPanel