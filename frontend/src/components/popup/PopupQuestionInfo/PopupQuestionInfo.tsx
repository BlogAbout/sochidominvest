import React, {useEffect} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IQuestion} from '../../../@types/IQuestion'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import classes from './PopupQuestionInfo.module.scss'
import {getQuestionTypeText} from '../../../helpers/questionHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Showdown from "showdown";

interface Props extends PopupProps {
    question: IQuestion
}

const defaultProps: Props = {
    question: {} as IQuestion
}

const PopupQuestionInfo: React.FC<Props> = (props) => {
    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    return (
        <Popup className={classes.PopupQuestionInfo}>
            <BlockingElement fetching={false} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={3}>{props.question.name}</Title>

                    <div className={classes.description}
                         dangerouslySetInnerHTML={{__html: converter.makeHtml(props.question.description)}}/>

                    <div className={classes.meta}>
                        <div className={classes.row} title='Дата публикации'>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{getFormatDate(props.question.dateCreated)}</span>
                        </div>

                        <div className={classes.row} title='Тип'>
                            <FontAwesomeIcon icon='star'/>
                            <span>{getQuestionTypeText(props.question.type)}</span>
                        </div>
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                        title='Закрыть'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupQuestionInfo.defaultProps = defaultProps
PopupQuestionInfo.displayName = 'PopupQuestionInfo'

export default function openPopupQuestionInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupQuestionInfo, popupProps, undefined, block, displayOptions)
}