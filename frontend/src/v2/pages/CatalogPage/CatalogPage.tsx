import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import classNames from 'classnames/bind'
import {ISubMenu} from '../../../@types/IMenu'
import {subMenuCatalog} from '../../helpers/menuHelper'
import {allowForRole, allowForTariff} from '../../helpers/accessHelper'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import Empty from '../../components/ui/Empty/Empty'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Avatar from '../../components/ui/Avatar/Avatar'
import classes from './CatalogPage.module.scss'

interface Props {
    name: string
    type: 'crm' | 'catalog'
}

const defaultProps: Props = {
    name: '',
    type: 'catalog'
}

const cx = classNames.bind(classes)

const CatalogPage: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const menu = useMemo(() => {
        return subMenuCatalog.filter((itemMenu: ISubMenu) => itemMenu.type === props.type)
    }, [props.type])

    return (
        <PanelView pageTitle={props.name}>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >{props.name}</Title>

                <BlockingElement fetching={false} className={classes.list}>
                    {menu && menu.length ?
                        menu.map((item) => {
                            if (!allowForRole(item.hasRole) || !allowForTariff(item.hasTariff)) {
                                return null
                            }

                            return (
                                <div key={item.href}
                                     className={cx({'item': true, 'disabled': item.disabled})}
                                     onClick={() => {
                                         if (!item.disabled) {
                                             navigate(item.href)
                                         }
                                     }}
                                >
                                    <Avatar href={item.icon}
                                            alt={item.title}
                                            width='100%'
                                            height='100%'
                                            withWrap
                                    />

                                    <div className={classes.itemContent}>
                                        <Title type='h3'
                                               style='right'
                                               className={classes.head}
                                        >{item.title}</Title>

                                        <div className={classes.description}>{item.description}</div>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message='Нет дополнительных разделов'/>
                    }
                </BlockingElement>
            </Wrapper>
        </PanelView>
    )
}

CatalogPage.defaultProps = defaultProps
CatalogPage.displayName = 'CatalogPage'

export default React.memo(CatalogPage)