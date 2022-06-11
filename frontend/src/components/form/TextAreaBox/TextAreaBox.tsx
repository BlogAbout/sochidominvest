import React from 'react'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import classes from './TextAreaBox.module.scss'
import 'react-mde/lib/styles/css/react-mde-all.css'

interface Props {
    value?: string
    autoFocus?: boolean,
    width?: string | number
    margin?: string | number
    flexGrow?: boolean
    placeHolder?: string
    title?: string
    readOnly?: boolean
    error?: boolean
    showRequired?: boolean
    icon?: IconProp
    errorText?: string
    isVisual?: boolean

    onChange(value: string): void
}

const defaultProps: Props = {
    value: '',
    isVisual: false,
    onChange(value: string): void {
        console.info('TextAreaBox onChange', value)
    }
}

const cx = classNames.bind(classes)

const TextAreaBox: React.FC<Props> = (props) => {
    const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>('write')

    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange(e.target.value || '')
    }

    const onChangeHandlerVisual = (value: string) => {
        props.onChange(value)
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    if (props.isVisual) {
        return (
            <div className={cx({'TextAreaBox': true, 'ReactMde': true})}
                 style={{
                     margin: props.margin,
                     width: props.width,
                     flexGrow: props.flexGrow ? 1 : undefined
                 }}
            >
                <ReactMde
                    value={props.value}
                    onChange={onChangeHandlerVisual}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(converter.makeHtml(markdown))
                    }
                    readOnly={props.readOnly}
                    classes={{
                        'reactMde': classes.reactMde,
                        'textArea': classes.mdeText
                    }}
                />
            </div>
        )
    }

    return (
        <div className={cx({'TextAreaBox': true, 'icon': !!props.icon})}
             style={{
                 margin: props.margin,
                 width: props.width,
                 flexGrow: props.flexGrow ? 1 : undefined
             }}
             title={props.title || props.placeHolder}
        >
            {props.icon && <div className={classes.icon}><FontAwesomeIcon icon={props.icon}/></div>}

            <textarea className={classes['input']}
                      onChange={onChangeHandler.bind(this)}
                      value={props.value === null ? '' : props.value}
                      placeholder={props.placeHolder || ''}
                      readOnly={props.readOnly}
                      autoFocus={props.autoFocus}
            />
        </div>
    )
}

TextAreaBox.defaultProps = defaultProps
TextAreaBox.displayName = 'TextAreaBox'

export default TextAreaBox