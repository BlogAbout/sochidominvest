import React from 'react'
import classes from './SectionAdvanced.module.scss'

const SectionAdvanced: React.FC = () => {
    return (
        <section className={classes.SectionAdvanced}>
            <div className={classes.container}>
                <div className={classes.list}>
                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                                interested.</p>
                            <a>Подробнее</a>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                                interested.</p>
                            <a>Подробнее</a>
                        </div>
                    </div>

                    <div className={classes.item}>
                        <div className={classes.content}>
                            <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
                                interested.</p>
                            <a>Подробнее</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

SectionAdvanced.displayName = 'SectionAdvanced'

export default SectionAdvanced