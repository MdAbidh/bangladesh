'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Bookmark,
  Settings,
  SkipBack,
  SkipForward,
  Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  title?: string;
  onProgress?: (progress: { played: number; playedSeconds: number; loaded: number }) => void;
  onComplete?: () => void;
  onBookmark?: (timestamp: number) => void;
  className?: string;
}

export function VideoPlayer({
  url,
  thumbnail,
  title,
  onProgress,
  onComplete,
  onBookmark,
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideControls = useCallback(() => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    hideControls();
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [playing, hideControls]);

  const handlePlayPause = () => setPlaying(!playing);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPlayed(val);
    setCurrentTime(val * duration);
  };

  const handleSeekMouseDown = () => setSeeking(true);
  const handleSeekMouseUp = () => setSeeking(false);

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      setCurrentTime(state.playedSeconds);
    }
    onProgress?.(state);
  };

  const handleDuration = (dur: number) => setDuration(dur);

  const handleEnded = () => {
    setPlaying(false);
    onComplete?.();
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (isPiP) {
      await document.exitPictureInPicture();
      setIsPiP(false);
    } else {
      try {
        const video = containerRef.current?.querySelector('video');
        if (video) {
          await video.requestPictureInPicture();
          setIsPiP(true);
        }
      } catch {
        // PiP not supported
      }
    }
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    playerRef.current?.seekTo(newTime / duration);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    playerRef.current?.seekTo(newTime / duration);
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-black',
        isFullscreen && 'rounded-none',
        className,
      )}
      onMouseMove={() => {
        setShowControls(true);
        hideControls();
      }}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Player */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
        style={{ aspectRatio: '16/9' }}
        light={thumbnail}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Center Play Button */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl text-white shadow-2xl transition-colors hover:bg-white/30"
            >
              <Play className="h-8 w-8 ml-1" />
            </motion.button>
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="absolute left-4 top-4">
            <h3 className="text-sm font-medium text-white drop-shadow-lg">{title}</h3>
          </div>
        )}

        {/* Top Right Controls */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            onClick={() => onBookmark?.(currentTime)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white transition-all"
            title="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Seek Bar */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={0.999999}
              step={0.001}
              value={played}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onChange={handleSeekChange}
              className="absolute inset-0 z-10 w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
            <div className="h-1 rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-100"
                style={{ width: `${played * 100}%` }}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              {/* Skip Backward */}
              <button
                onClick={skipBackward}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={skipForward}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1 group/vol">
                <button
                  onClick={() => setMuted(!muted)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <div className="w-0 overflow-hidden transition-all group-hover/vol:w-20">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 cursor-pointer accent-white"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-xs text-white/70 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Playback speed"
                >
                  <Settings className="h-3.5 w-3.5" />
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 rounded-xl border border-gray-800 bg-gray-900 p-1 shadow-xl">
                    {speeds.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          setPlaybackRate(speed);
                          setShowSpeedMenu(false);
                        }}
                        className={cn(
                          'block w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors',
                          speed === playbackRate
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800',
                        )}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PiP */}
              <button
                onClick={togglePiP}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Picture in picture"
              >
                <Monitor className="h-4 w-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
