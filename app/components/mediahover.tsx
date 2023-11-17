import React, {useEffect, useMemo, useRef, useState} from 'react';
import Image from 'next/image';

const mediaList = [
  {type: 'video', src: '/marseille.mov'},
  {type: 'video', src: '/bethnal.mov'},
  {type: 'video', src: '/boston.mov'},
  {type: 'video', src: '/ny.mov'},
];

export const MediaHover = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Set up a timer to change the media every 10 seconds
    const timer = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

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

  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') return window.matchMedia("(max-width: 768px)").matches;
  }, []);

  // Get the current media item
  const {type, src} = mediaList[currentMediaIndex];

  return (
    <div className="custom-hover-transform"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
    >
      <div>
        {type === 'image' ? (
          <Image width="100" height="100" src={src} alt="Highlights"/>
        ) : (
          <video width="100" height="100" autoPlay controls={isMobile}
                 muted={true}
                 src={src}
                 ref={videoRef}
                 controlsList="nodownload noplaybackrate noplaybackrate nodirectionsubmenu"/>
        )}
      </div>
    </div>
  );
};