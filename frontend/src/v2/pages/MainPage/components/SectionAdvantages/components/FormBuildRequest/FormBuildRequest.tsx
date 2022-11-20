import React, {useMemo, useState} from 'react'
import {IRadio} from '../../../../../../@types/IRadio'
import {IFeed} from '../../../../../../../@types/IFeed'
import FeedService from '../../../../../../../api/FeedService'
import Field from '../../../../../../components/form/Field/Field'
import Radio from '../../../../../../components/form/Radio/Radio'
import TextBox from '../../../../../../components/form/TextBox/TextBox'
import Button from '../../../../../../components/form/Button/Button'
import Title from '../../../../../../components/ui/Title/Title'
import BlockingElement from '../../../../../../../components/ui/BlockingElement/BlockingElement'
import openPopupAlert from '../../../../../../../components/PopupAlert/PopupAlert'
import classes from './FormBuildRequest.module.scss'

const FormBuildRequest: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [formData, setFormData] = useState({
        type: 'buy',
        name: '',
        phone: ''
    })

    const radioItems: IRadio[] = useMemo((): IRadio[] => {
        return [
            {key: 'buy', text: 'Купить'},
            {key: 'rent', text: 'Снять'}
        ]
    }, [])

    const onSendRequestHandler = () => {
        if (formData.name.trim() === '' || formData.phone.trim() === '') {
            return
        }

        const feed: IFeed = {
            id: null,
            author: null,
            phone: formData.phone,
            name: formData.name,
            title: `Заявка на помощь в ${formData.type === 'buy' ? 'покупке' : 'аренде'} недвижимости`,
            type: 'feed',
            objectId: null,
            objectType: null,
            active: 1,
            status: 'new'
        }

        setFetching(true)

        FeedService.saveFeed(feed)
            .then(() => {
                openPopupAlert(document.body, {
                    text: 'Ваша заявка успешно отправлена. Наш менеджер свяжется с Вами в ближайшее время.'
                })
            })
            .catch((error: any) => {
                console.error(error.data)
                openPopupAlert(document.body, {
                    text: 'Произошла ошибка отправки Вашей заявки. Обновите страницу или попробуйте позже.'
                })
            })
            .finally(() => {
                setFetching(false)
                setFormData({
                    type: 'buy',
                    name: '',
                    phone: ''
                })
            })
    }

    return (
        <div className={classes.FormBuildRequest}>
            <BlockingElement fetching={fetching} className={classes.inner}>
                <Title type='h2'
                       className={classes.title}
                >Оставьте заявку и мы Вам перезвоним</Title>

                <Field>
                    <Radio items={radioItems}
                           current={formData.type}
                           onChange={(value: string) => setFormData({...formData, type: value})}
                    />
                </Field>

                <Field label='Имя'>
                    <TextBox value={formData.name}
                             placeHolder='Имя'
                             onChange={(value: string) => setFormData({...formData, name: value})}
                             styleType='standard'
                             error={!formData.name.trim()}
                             errorText='Укажите имя'
                             width='100%'
                    />
                </Field>

                <Field label='Телефон'>
                    <TextBox value={formData.phone}
                             placeHolder='Телефон'
                             onChange={(value: string) => setFormData({...formData, phone: value})}
                             styleType='standard'
                             error={!formData.phone.trim()}
                             errorText='Укажите номер телефона'
                    />
                </Field>

                <div className={classes.buttons}>
                    <Button type='apply'
                            onClick={() => onSendRequestHandler()}
                            title='Отправить'
                            disabled={!formData.name.trim() || !formData.phone.trim()}
                    >Отправить</Button>
                </div>
            </BlockingElement>
        </div>
    )
}

FormBuildRequest.displayName = 'FormBuildRequest'

export default FormBuildRequest