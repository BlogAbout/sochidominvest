import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import * as Showdown from 'showdown'
import {useParams} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getFormatDate} from '../../../helpers/dateHelper'
import {IPartner} from '../../../@types/IPartner'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import classes from './PartnerItemPage.module.scss'

type PartnerItemPageParams = {
    id: string
}

interface Props {
    public?: boolean
}

const defaultProps: Props = {
    public: false
}

const PartnerItemPage: React.FC<Props> = (props) => {
    const params = useParams<PartnerItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [partner, setPartner] = useState<IPartner>({} as IPartner)

    const {partners, fetching: fetchingPartnerList} = useTypedSelector(state => state.partnerReducer)
    const {fetchPartnerList} = useActions()

    useEffect(() => {
        if (isUpdate || !partners.length) {
            fetchPartnerList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const partnerId = parseInt(params.id)
            const partnerInfo = partners.find((partner: IPartner) => partner.id === partnerId)

            if (partnerInfo) {
                setPartner(partnerInfo)
            }
        }
    }, [partners, params.id])

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    return (
        <main className={classes.PartnerItemPage}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>
                    {!partner ? 'Партнер и Спонсор - СочиДомИнвест' : !partner.metaTitle ? `${partner.name} - СочиДомИнвест` : `${partner.metaTitle} - СочиДомИнвест`}
                </title>
                <meta name='description'
                      content={!partner || !partner.metaDescription ? '' : partner.metaDescription}
                />
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <BlockingElement fetching={fetchingPartnerList} className={classes.block}>
                        {partner.avatar ?
                            <div className={classes.col}>
                                <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + partner.avatar}
                                     alt={partner.name}
                                />
                            </div>
                            : null
                        }

                        <div className={partner.avatar ? classes.col : classes.colFull}>
                            <h1><span>{partner.name}</span></h1>

                            <div className={classes.information}>
                                <div className={classes.icon}
                                     title={`Дата публикации: ${getFormatDate(partner.dateCreated)}`}>
                                    <FontAwesomeIcon icon='calendar'/>
                                    <span>{getFormatDate(partner.dateCreated)}</span>
                                </div>

                                {partner.authorName ?
                                    <div className={classes.icon} title={`Автор: ${partner.authorName}`}>
                                        <FontAwesomeIcon icon='user'/>
                                        <span>{partner.authorName}</span>
                                    </div>
                                    : null}
                            </div>

                            {partner.subtitle ? <div className={classes.subtitle}>{partner.subtitle}</div> : null}
                        </div>

                        <div className={classes.description}
                             dangerouslySetInnerHTML={{__html: converter.makeHtml(partner.description)}}
                        />
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

PartnerItemPage.defaultProps = defaultProps
PartnerItemPage.displayName = 'PartnerItemPage'

export default PartnerItemPage