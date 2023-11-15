import React from 'react';

export const VideoHover = ({src}) => {
  const videoRef = React.useRef(null);
  const isPlaying = React.useRef(false);

  const handleMouseEnter = async () => {
    if (videoRef.current && !isPlaying.current) {
      try {
        await videoRef.current.play();
        isPlaying.current = true;
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && isPlaying.current) {
      videoRef.current.pause();
      isPlaying.current = false;
    }
  };

  return (
    <div className="hover:scale-110 transition-transform duration-200">
      <video
        width="320"
        height="240"
        ref={videoRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        controls
        loop
      >
        <source src={src} type="video/quicktime"/>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

