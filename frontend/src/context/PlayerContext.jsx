import { createContext, useState, useRef, useEffect } from "react";
import { songsData } from '../assets/assets';

export const PlayerContext = createContext();

const PlayerContextProvider = (props)=>{

    const audioRef = useRef();
    const seekBar = useRef();
    const seekBg = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime:{
            second:0,
            minute:0
        },
        totalTime:{
            second:0,
            minute:0
        }
    })

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);

    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async(id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async() => {
        if(track.id > 0){
            await setTrack(songsData[track.id - 1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const next = async() => {
        if(track.id < songsData.length -1){
            await setTrack(songsData[track.id + 1]);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    }

    const seekSong = (e) => {
        if (audioRef.current && audioRef.current.duration) {
          const clickPosition = e.nativeEvent.offsetX; // Click position on seek bar
          const seekBarWidth = seekBg.current.offsetWidth; // Full width of the seek bar background
          const newTime = (clickPosition / seekBarWidth) * audioRef.current.duration; // Calculate new time based on click
          audioRef.current.currentTime = newTime; // Set new playback time
        }
      };
      

    useEffect(() => {
        if (audioRef.current) {
          audioRef.current.ontimeupdate = () => {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            seekBar.current.style.width = `${progress}%`;
            
            setTime({
              currentTime: {
                second: Math.floor(audioRef.current.currentTime % 60),
                minute: Math.floor(audioRef.current.currentTime / 60),
              },
              totalTime: {
                second: Math.floor(audioRef.current.duration % 60),
                minute: Math.floor(audioRef.current.duration / 60),
              },
            });
          };
        }
      }, [audioRef]);      
      
    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong
    }
    return(
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider