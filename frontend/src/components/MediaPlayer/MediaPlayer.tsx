import React from 'react'
import {
    BigPlayButton,
    ControlBar,
    CurrentTimeDisplay,
    ForwardControl,
    LoadingSpinner,
    PlaybackRateMenuButton,
    Player,
    ReplayControl,
    TimeDivider,
    VolumeMenuButton
} from 'video-react'
import 'video-react/styles/scss/video-react.scss'
import classes from './MediaPlayer.module.scss'

interface Props {
    source: string
    poster?: string
    controls?: boolean
    type?: 'video' | 'audio'
}

const defaultProps: Props = {
    source: '',
    controls: false,
    type: 'video'
}

const MediaPlayer: React.FC<Props> = (props) => {
    const renderAudioPlayer = () => {
        return null
    }

    const renderVideoPlayer = () => {
        return (
            <Player poster={props.poster ? `https://api.sochidominvest.ru/uploads/image/full/${props.poster}` : ''}
                    src={props.source}
                    height='100%'
            >
                {props.controls ?
                    <ControlBar autoHide={true} disableDefaultControls>
                        <LoadingSpinner/>
                        <BigPlayButton position='center'/>
                        <ReplayControl seconds={10} order={1.1}/>
                        <ForwardControl seconds={30} order={1.2}/>
                        <CurrentTimeDisplay order={4.1}/>
                        <TimeDivider order={4.2}/>
                        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1}/>
                        <VolumeMenuButton vertical/>
                    </ControlBar>
                    : null
                }
            </Player>
        )
    }

    return (
        <div className={classes.Player}>
            {!props.type || props.type === 'video' ? renderVideoPlayer() : renderAudioPlayer()}
        </div>
    )
}

MediaPlayer.defaultProps = defaultProps
MediaPlayer.displayName = 'MediaPlayer'

export default MediaPlayer