import React from 'react'
import Helmet from 'react-helmet'
import {configuration} from '../../../../helpers/utilHelper'

interface Props {
    title: string
    description?: string
}

const PageMetaInfo: React.FC<Props> = (props): React.ReactElement => {
    return (
        <Helmet>
            <meta charSet='utf-8'/>
            <title>{props.title} - {configuration.siteTitle}</title>
            <meta name='description' content={props.description || ''}/>
            <link rel='canonical' href={`${window.location.href}`}/>
        </Helmet>
    )
}

PageMetaInfo.displayName = 'PageMetaInfo'

export default React.memo(PageMetaInfo)