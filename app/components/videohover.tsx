import React, {useRef} from 'react';

interface VideoHoverProps {
  src: string;
}

export const VideoHover: React.FC<VideoHoverProps> = ({src}) => {
  // Explicitly type the ref as a HTMLVideoElement
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Play video on hover
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current?.play();
    }
  };

  // Pause video when not hovering
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current?.pause();
    }
  };

  return (
    <div className="custom-hover-transform"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}>
      <video width="150" height="150" controls ref={videoRef}>
        <source src={src} type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
