import React from 'react'
import classes from './SectionAdvanced.module.scss'

const SectionAdvanced: React.FC = () => {
    return (
        <section className={classes.SectionAdvanced}>
            <div className={classes.container}>
                <div className={classes.list}>
                    <div className={classes.item}>
                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </div>

                    <div className={classes.item}>
                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </div>

                    <div className={classes.item}>
                        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.
                    </div>
                </div>
            </div>
        </section>
    )
}

SectionAdvanced.displayName = 'SectionAdvanced'

export default SectionAdvanced