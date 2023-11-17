import React, {useEffect, useMemo, useRef, useState} from 'react';
import Image from 'next/image';

const mediaList = [
  {type: 'video', src: '/marseille.mov'},
  {type: 'video', src: '/bethnal.mov'},
  {type: 'video', src: '/boston.mov'},
  {type: 'video', src: '/ny.mov'},
];

export const MediaHover = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(-1);
  const [isClient, setIsClient] = useState(false); // New state to track if we're on the client
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsClient(true);

    const thirtySeconds = 30000;
    const currentTime = new Date().getTime();

    const lastUpdateTime = localStorage.getItem('lastUpdateTime');
    const savedIndex = localStorage.getItem('currentMediaIndex');

    if (lastUpdateTime && savedIndex) {
      const elapsedTime = currentTime - parseInt(lastUpdateTime);
      if (elapsedTime >= thirtySeconds) {
        const newIndex = (parseInt(savedIndex) + 1) % mediaList.length;
        setCurrentMediaIndex(newIndex);
        localStorage.setItem('currentMediaIndex', newIndex.toString());
        localStorage.setItem('lastUpdateTime', currentTime.toString());
      } else {
        setCurrentMediaIndex(parseInt(savedIndex));
      }
    } else {
      // No data in localStorage, initialize it
      localStorage.setItem('currentMediaIndex', '0');
      localStorage.setItem('lastUpdateTime', currentTime.toString());
    }
  }, []);

  const isValidMediaIndex = currentMediaIndex >= 0 && currentMediaIndex < mediaList.length;

  const handleMouseEnter = () => {
    if (videoRef.current && isValidMediaIndex) {
      videoRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && isValidMediaIndex) {
      videoRef.current?.pause();
    }
  };


  const {
    type = '',
    src = ''
  } = isValidMediaIndex ? mediaList[currentMediaIndex] : {};

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
            controls={isMobile}
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