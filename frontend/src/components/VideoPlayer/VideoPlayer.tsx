import React, {useRef} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import useVideoPlayer from '../../hooks/useVideoPlayer'
import classes from './VideoPlayer.module.scss'

interface Props {
    video: string
    showControl?: boolean
}

const defaultProps: Props = {
    video: '',
    showControl: false
}

const VideoPlayer: React.FC<Props> = (props) => {
    const videoElement = useRef<HTMLVideoElement>(null)

    const {
        playerState,
        togglePlay,
        handleOnTimeUpdate,
        handleVideoProgress,
        toggleMute,
    } = useVideoPlayer(videoElement)

    return (
        <div className={classes.VideoPlayer}>
            <div className={classes.wrapper}>
                <div className={classes.videoContainer}>
                    <video src={props.video} ref={videoElement} onTimeUpdate={handleOnTimeUpdate}/>
                </div>

                <div className={classes.controls}>
                    <div className={classes.actions}>
                        <div onClick={togglePlay}>
                            {!playerState.isPlaying
                                ? <FontAwesomeIcon icon='play'/>
                                : <FontAwesomeIcon icon='pause'/>
                            }
                        </div>
                    </div>

                    <input
                        type='range'
                        min='0'
                        max='100'
                        value={playerState.progress}
                        onChange={(e) => handleVideoProgress(e)}
                    />

                    <div className={classes.actions}>
                        <div onClick={toggleMute}>
                            {!playerState.isMuted
                                ? <FontAwesomeIcon icon='volume-high'/>
                                : <FontAwesomeIcon icon='volume-xmark'/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

VideoPlayer.defaultProps = defaultProps
VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer