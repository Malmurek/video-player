import { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import {
  BiSkipPrevious,
  BiSkipNext,
  BiPlay,
  BiPause,
  BiFullscreen,
  BiSolidVolumeFull,
  BiSolidVolumeMute,
} from "react-icons/bi";
import video from "./assets/Filmik.mp4";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [mute, setIsMuted] = useState(false);

  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState(0);

  useEffect(() => {
    if (videoRef.current.duration > 0) {
      const { min, sec } = convertTime(videoRef.current.duration);
      setDurationSec(videoRef.current.duration);
      setDuration([min, sec]);
    }

    const updateTime = setInterval(() => {
      const { min, sec } = convertTime(videoRef.current.currentTime);
      setCurrentTimeSec(videoRef.current.currentTime);
      setCurrentTime([min, sec]);
    }, 1000);
    console.log(videoRef.current.currentTime);
    return () => clearInterval(updateTime);
  }, [isPlaying]);

  const forwardTime = () => {
    videoRef.current.currentTime += 10;
  };

  const backTime = () => {
    videoRef.current.currentTime -= 10;
  };

  const fullScreenPlay = () => {
    if (fullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const changePlaybackRate = (rate) => {
    console.log(rate);
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  const convertTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: String(secRemain).padStart(2, "0"),
    };
  };

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      videoRef.current.src = fileURL;
    }
  };

  const muteVideo = () => {
    setIsMuted(!mute);
  };

  return (
    <IconContext.Provider value={{ color: "white", size: "2em" }}>
      <div className="wrapper">
        <div className="videoContainer">
          <video
            className="videoPlayer"
            ref={videoRef}
            muted={mute}
            src={video}
            onEnded={() => setIsPlaying(false)}
          ></video>
          <input
            type="range"
            min="0"
            max={durationSec}
            default="0"
            value={currentTimeSec}
            className="lineOfTime"
            onChange={(e) => {
              videoRef.current.currentTime = e.target.value;
            }}
          ></input>
          <div className="durationTime">
            {currentTime[0]}:{currentTime[1]}/{duration[0]}:{duration[1]}
          </div>
          <div className="controls">
            <div className="speedAndPlay">
              <button className="controlButton" onClick={backTime}>
                <BiSkipPrevious />
              </button>
              {isPlaying && currentTimeSec != durationSec ? (
                <button className="controlButton" onClick={handlePlay}>
                  <BiPause />
                </button>
              ) : (
                <button className="controlButton" onClick={handlePlay}>
                  <BiPlay />
                </button>
              )}
              <button className="controlButton" onClick={forwardTime}>
                <BiSkipNext />
              </button>
            </div>
            <div className="fullScreen">
              {mute ? (
                <button className="controlButton" onClick={muteVideo}>
                  <BiSolidVolumeMute />
                </button>
              ) : (
                <button className="controlButton" onClick={muteVideo}>
                  <BiSolidVolumeFull />
                </button>
              )}

              <select
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
              >
                <option value="0.25">0.25x</option>
                <option value="0.50">0.50x</option>
                <option value="0.75">0.75x</option>
                <option value="1" selected>
                  1.00x
                </option>
                <option value="1.25">1.25x</option>
                <option value="1.50">1.50x</option>
                <option value="1.75">1.75x</option>
                <option value="2.00">2.00x</option>
              </select>
              <button className="controlButton" onClick={fullScreenPlay}>
                <BiFullscreen />
              </button>
            </div>
          </div>
          <input
            className="chooseFile"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default App;
