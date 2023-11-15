"use client"

import React, {FC} from 'react';
import {ContactLink} from "@/app/components/contactlink";
import {GitHubIcon, LinkedInIcon, TwitterIcon} from "@/app/components/icons";
import {VideoHover} from "@/app/components/videohover";

const HomePage: FC = () => {
  return (
    <section id="intro">
      <div className="h-full flex items-end justify-between">
        <div className="flex ">
          <div className="vertical-text text-white flex items-center text-xs">
            HIGHLIGHTS
          </div>
          <div className="w-18 h-18">
            <VideoHover src="/marseille.mov"/>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full ">
          <div className="contact-details text-sm">
            <ContactLink name={"Twitter"} link={'https://twitter.com/ODavidOlagunju'} icon={<TwitterIcon/>}/>
            <ContactLink name={"LinkedIn"} link={'https://www.linkedin.com/in/david-olagunju-143aa8a7/'}
                         icon={<LinkedInIcon/>}/>
            <ContactLink name={"Github"} link={'https://github.com/odavidola'} icon={<GitHubIcon/>}/>
          </div>
          <div className="text-sm mt-10 w-125">
            <p>Born in 1996</p>
            <p>in Ibadan, Nigeria.</p>
            <br/>
            <p>I believe the world is only as large as our perception of it. Cultivating our
              awareness expands the scope, not just of the material at our disposal to create
              from, but of the life we get to live.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
