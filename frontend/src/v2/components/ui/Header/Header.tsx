import React from 'react'
import Wrapper from '../Wrapper/Wrapper'
import Logo from './components/Logo/Logo'
import MainMenu from './components/MainMenu/MainMenu'
import classes from './Header.module.scss'

interface Props {
    type?: 'default' | 'panel'
}

const defaultProps: Props = {
    type: 'default'
}

const Header: React.FC<Props> = (props): React.ReactElement | null => {
    const renderHeaderByType = () => {
        switch (props.type) {
            case 'default': {
                return (
                    <div className={classes.Header}>
                        <Wrapper>
                            <div className={classes.inner}>
                                <Logo type='short'/>

                                <MainMenu/>
                            </div>
                        </Wrapper>
                    </div>
                )
            }
            case 'panel': {
                return null
            }
            default:
                return null
        }
    }

    return renderHeaderByType()
}

Header.defaultProps = defaultProps
Header.displayName = 'Header'

export default React.memo(Header)