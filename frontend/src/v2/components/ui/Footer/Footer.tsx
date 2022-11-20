import React from 'react'
import Wrapper from '../Wrapper/Wrapper'
import FooterMenu from './components/FooterMenu/FooterMenu'
import Contacts from '../Contacts/Contacts'
import classes from './Footer.module.scss'

const Footer: React.FC = (): React.ReactElement => {
    return (
        <div className={classes.Footer}>
            <div className={classes.footerFirst}>
                <Wrapper>
                    <div className={classes.inner}>
                        <FooterMenu/>

                        <Contacts align='right'/>
                    </div>
                </Wrapper>
            </div>

            <div className={classes.footerSecond}>
                <Wrapper>
                    <div className={classes.copyright}>
                        2022. Все права защищены
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}

Footer.displayName = 'Footer'

export default React.memo(Footer)