import React from "react";

const Header = ({ currentBall, runs, wickets, overNo }) => {
  return (
    <div className="header h-fit mt-2">
      <div className="header-conntent  h-full mx-auto md:w-5/6 sm:w-1/2 ">
        <div className="score mx-auto   h-full ">
          <div className="score-info flex w-3/4 sm:text-7xl  text-6xl font-bold mx-auto justify-center">
            <span>{runs}</span>
            <span>/</span>
            <span>{wickets}</span>
          </div>
          <div className="over-info w-3/4 mx-auto  sm:text-3xl text-xl justify-center">
            over ( {overNo}.{currentBall} )
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
