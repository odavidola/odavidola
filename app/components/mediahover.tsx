import React, {useEffect, useState} from 'react';
import Image from 'next/image';

const mediaList = [
  {type: 'video', src: '/marseille.mov'},
  {type: 'video', src: '/bethnal.mov'},
  {type: 'video', src: '/boston.mov'},
  {type: 'video', src: '/ny.mov'},
];

const isMobileView = () => {
  // This checks if the screen width is less than or equal to 768 pixels
  return window.matchMedia("(max-width: 768px)").matches;
};

export const MediaHover = () => {
  // Explicitly type the ref as ¡a HTMLVideoElement
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    // Set up a timer to change the media every 10 seconds
    const timer = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
    }, 10000);

    // Clear the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Get the current media item
  const {type, src} = mediaList[currentMediaIndex];

  return (
    <div className="custom-hover-transform"
    >
      <div>
        {type === 'image' ? (
          <Image width="100" height="100" src={src} alt="Highlights"/>
        ) : (
          <video width="100" height="100" autoPlay={!isMobileView()} loop={!isMobileView()} controls={isMobileView()}
                 src={src}
                 controlsList="nodownload noplaybackrate noplaybackrate nodirectionsubmenu"/>
        )}
      </div>
    </div>
  );
};