import React from 'react';

const HomePage: React.FC = () => {
  return (
    <section id="intro">
      <div className="flex flex-col justify-end items-end h-full w-full">
        <div className="text-sm mt-10 w-125">
          <p>Born in 1996 in Ibadan, Nigeria.</p>
          <br/>
          <p>I believe the world is only as large as our perception of it.</p>
          <p>Cultivating our awareness expands the scope, not just of the material at our disposal to create
            from, but of the life we get to live</p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
