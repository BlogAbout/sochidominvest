import React, {useMemo} from 'react'
import Wrapper from '../../../../components/ui/Wrapper/Wrapper'
import Grid from '../../../../components/ui/Grid/Grid'
import GridColumn from '../../../../components/ui/Grid/components/GridColumn/GridColumn'
import IconItem from '../../../../components/ui/IconItem/IconItem'
import FormBuildRequest from './components/FormBuildRequest/FormBuildRequest'
import classes from './SectionAdvantages.module.scss'

const SectionAdvantages: React.FC = (): React.ReactElement => {
    const advantages = useMemo(() => {
        return [
            {
                icon: 'warehouse',
                type: 'round',
                style: 'light',
                text: 'Многофункциональный сервис в теме недвижимость'
            },
            {
                icon: 'money-check-dollar',
                type: 'round',
                style: 'light',
                text: 'Покупка, продажа, аренда, инвестирование'
            },
            {
                icon: 'handshake',
                type: 'round',
                style: 'light',
                text: 'Сопровождение сделок под ключ с прозрачным сервисом, отчётами и уведомлениями'
            },
            {
                icon: 'building',
                type: 'round',
                style: 'light',
                text: 'Актуальный каталог новостроек и вторичной недвижимости'
            }
        ]
    }, [])

    return (
        <section className={classes.SectionAdvantages}>
            <Wrapper>
                <div className={classes.inner}>
                    <Grid className={classes.cols}>
                        <GridColumn width='35%'>
                            <FormBuildRequest/>
                        </GridColumn>

                        <GridColumn width='65%'>
                            <div className={classes.list}>
                                {advantages.map((item: any, index: number) => {
                                    return (
                                        <IconItem key={index} {...item}/>
                                    )
                                })}
                            </div>
                        </GridColumn>
                    </Grid>
                </div>
            </Wrapper>
        </section>
    )
}

SectionAdvantages.displayName = 'SectionAdvantages'

export default React.memo(SectionAdvantages)