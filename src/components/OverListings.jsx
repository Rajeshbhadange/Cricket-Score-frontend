import React, { useEffect, useState } from "react";
import colors from "../assets/colors";
const OverListings = ({ overNo, lastThreeOvers, overArr, currentBall }) => {
  return (
    <div className="overistion-container mt-2  w-[100%]">
      <div className="heading w-fit h-fit p-2 text-2xl font-bold">
        <span className="heading-content left-0 300:text-lg">Over Listing</span>
      </div>
      <div className="subheadings flex flex-row text-2xl  w-[30%] p-1 justify-between">
        <span className="300:text-sm md:text-xl">Overs</span>
        <span className="300:text-sm md:text-xl">Runs</span>
      </div>
      <div className="over-info w-[100%]  h-30">
        {lastThreeOvers &&
          lastThreeOvers.map((obj, index) => {
            return (
              <div
                key={index}
                className="overs lg:w-[95%] flex sm:w-[100%] md:ml-3  375:w-[90%]  justify-between mb-3 flex-row"
              >
                <span className="sm:text-4xl mx-4 mt-2 300:text-lg md:text-2xl">
                  {overArr[index]}
                </span>
                <div className="flex justify-between sm:w-[80%] border 500:w-[80%]  sm:p-2 300:p-1 375:ml-2 md:w-[85%] border-black 300:w-[300px]">
                  {Object.keys(obj).map((key) => {
                    let value = obj[key];

                    let color = value == "" ? "white" : colors[value].color;
                    let textColor = value == "" ? "black" : colors[value].text;
                    return (
                      <div
                        key={key}
                        className={`flex 375:ml-[13px] text-${textColor}  items-center justify-center sm:w-14 300:w-8   sm:h-14 300:h-8  md:h-14 md:w-14 ${
                          overArr[index] - 1 == overNo && currentBall == key
                            ? "border-yellow-300 border-[6px] border-solid:"
                            : "border-black"
                        }  justify-center w-14 h-14 border border-black rounded-full`}
                        style={{
                          backgroundColor: color,
                          transition: "background-color 0.3s",
                        }}
                      >
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default OverListings;
