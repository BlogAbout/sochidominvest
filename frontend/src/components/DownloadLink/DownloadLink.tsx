import React from 'react'

interface Props {
    className?: string
    style?: React.CSSProperties
    href: string
    target?: '_self' | '_blank'
    title?: string
    download: string
}

const defaultProps: Props = {
    className: '',
    style: {},
    href: '',
    target: '_self',
    title: 'Скачать',
    download: '',
}

const DownloadLink: React.FC<Props> = (props) => {
    return (
        <a className={props.className}
           style={props.style}
           href={`/download.php?url=${encodeURI(props.href)}`}
           target={props.target}
           title={props.title ? props.title : props.download}
           download={props.download}
        >{props.children || props.title}</a>
    )
}

DownloadLink.defaultProps = defaultProps
DownloadLink.displayName = 'DownloadLink'

export default DownloadLink