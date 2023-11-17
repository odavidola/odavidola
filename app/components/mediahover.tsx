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
  const [isClient, setIsClient] = useState(false); // New state to track if we're on the client
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current?.pause();
    }
  };

  const {type, src} = mediaList[currentMediaIndex];

  const isMobile = useMemo(() => {
    return isClient && window.matchMedia("(max-width: 768px)").matches;
  }, [isClient]);

  return (
    <div className="custom-hover-transform"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
    >
      <div>
        {type === 'image' ? (
          <Image width="100" height="100" src={src} alt="Highlights"/>
        ) : (
          <video
            width="100"
            height="100"
            autoPlay={!isMobile ?? undefined}
            playsInline
            muted
            src={src}
            ref={videoRef}
            controlsList="nodownload noplaybackrate nodirectionsubmenu"/>
        )}
      </div>
    </div>
  );
};