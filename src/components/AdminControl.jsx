import React, { useRef } from "react";
import { socket } from "../Socket";
import colors from "../assets/colors";

const AdminControl = ({
  setCurrentBall,
  lastThreeOvers,
  setLastThreeOvers,
  setWickets,
  runs,
  setRuns,
  overNo,
  setOverNo,
  overValue,
  moveValue,
  setMoveValue,
  setOverValue,
  wickets,
  currentBall,
  overArr,
  setOverArr,
}) => {
  const op = [0, 1, 2, 3, 4, 6, "Out"];

  const myElementRef = useRef(null);
  const updateState = (value) => {
    if (value == "Out") {
      setWickets((prev) => prev + 1);
    } else {
      setRuns((prev) => prev + value);
    }
    setOverValue((prev) => ({
      ...prev,
      [currentBall]: value,
    }));

    currentBall == 5 ? setOverNo((prev) => prev + 1) : "";

    let over = lastThreeOvers[overNo > 2 ? 2 : overNo % 3];
    over[currentBall] = value;
    let newOver = [...lastThreeOvers];
    newOver[overNo] = over;

    if (currentBall === 5 && lastThreeOvers.length < 3) {
      newOver.push({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
      setLastThreeOvers(newOver);
    }

    if (currentBall === 5 && lastThreeOvers.length === 3) {
      let newOvers = [...lastThreeOvers];
      newOvers = newOvers.filter((ele, index) => index != 0);
      newOvers.push({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
      setLastThreeOvers(newOvers);
    }

    if (currentBall == 5 && overArr.length < 3) {
      let newOverArr = [...overArr];
      newOverArr.push(newOverArr[newOverArr.length - 1] + 1);
      setOverArr(newOverArr);
    }

    if (currentBall === 5 && lastThreeOvers.length === 3) {
      let newOverArr = [...overArr];
      newOverArr = newOverArr.filter((ele, index) => index != 0);
      newOverArr.push(newOverArr[newOverArr.length - 1] + 1);
      setOverArr(newOverArr);
    }
  };

  const updateMoveValue = () => {
    const boundingRect = myElementRef.current.getBoundingClientRect();
    const value = boundingRect.width;

    if (200 < value && value < 300) setMoveValue(10);
    else if (301 < value && value < 340) setMoveValue(20);
    else if (340 < value && value < 400) setMoveValue(30);
    else if (401 < value && value < 500) setMoveValue(20);
    else if (501 < value && value < 600) setMoveValue(60);
    else if (600 < value && value < 700) setMoveValue(70);
    else if (701 < value && value < 800) setMoveValue(80);
    else if (801 < value && value < 899) setMoveValue(100);
    else if (900 < value && value < 1100) setMoveValue(130);
    else if (1100 < value && value < 1500) setMoveValue(120);

    console.log(moveValue);
  };

  const handleRunsOrWickets = (value) => {
    const boundingRect = myElementRef.current.getBoundingClientRect();
    const widthValue = boundingRect.width;

    updateMoveValue();
    let matchId = localStorage.getItem("matchId");
    if (currentBall == 5) {
      setCurrentBall(0);
      updateState(value);
      setTimeout(() => {
        setOverValue({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
      }, 700);

      socket.emit("publishscore", {
        currentBall,
        value,
        overFinished: true,
        widthValue,
        moveValue,
        runs,
        wickets,
        matchId,
        overNo,
      });
    } else {
      setCurrentBall((prev) => prev + 1);
      updateState(value);
      socket.emit("publishscore", {
        currentBall,
        value,
        overFinished: false,
        moveValue,
        widthValue,
        runs,
        wickets,
        matchId,
        overNo,
      });
    }
  };

  return (
    <div
      ref={myElementRef}
      className="current-over relative mb-10 w-full h-fit
    mt-2  "
    >
      <div className="heading 375:w-32  300:w-28 mb-3  h-fit 375:text-xl 300:p-0 300:text-lg font-bold ">
        <span className="heading-content left-0">This Over</span>
      </div>
      <div className="border-dashed  h-16 border-4 sm:w-[96%] 300:w-[100%] mx-auto rounded-lg border-gray-300 -z-10 p-4 relative">
        <span className="absolute ml-[50%] sm:ml-[15%]  300:ml-9 300:text-sm  md:ml-[20%] sm:text-sm lg:ml-[25%] xl:ml-[30%] 2xl:ml-[40%] text-gray-700 text-lg  w-fit -mt-[31px]  bg-white">
          next over
        </span>
        <img
          src="./grayarrow.jpb-removebg-preview.png"
          className="w-8 z-1 h-8 lg:ml-2 xl:ml-3 m:w-6 sm:h-6 sm:-ml-2 sm:mt-[29px] mt-[26px] ml-2 text-gray"
          alt=""
        />
      </div>

      <div
        className="border-2 sm:w-[85%] w-[95%]
      border-black -mt-12 z-50 mx-auto sm:p-4 p-2 h-fit bg-white"
      >
        <div className="flex justify-between">
          {Object.keys(overValue).map((key, index) => {
            let color =
              overValue[key] == "" ? "white" : colors[overValue[key]].color;
            let textColor =
              overValue[key] == "" ? "black" : colors[overValue[key]].text;

            return (
              <div key={key}>
                <div
                  className={`flex items-center  justify-center sm:w-16 w-9   text-${textColor} sm:h-16 h-9 border ${currentBall == key
                    ? "border-yellow-300 border-[8px] border-solid:"
                    : "border-black"
                    }  rounded-full`}
                  style={{
                    backgroundColor: color,
                    transition: "background-color 0.3s",
                  }}
                >
                  <span className="text-xl">{overValue[key]}</span>
                </div>
                <span className="text-red-500 300:text-xs  375:text-sm 425:text-lg">{`${parseInt(key) + 1
                  } ball`}</span>
                {currentBall === index ? (
                  <img
                    src="./downward-removebg-preview.png"
                    width={40}
                    height={30}
                    className="-mt-6 300:-ml-[0.01px] sm:ml-3 sm:w-[40px] 300:w-[30px]  absolute mx-auto"
                    alt=""
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="">
        <div
          className="mt-2 -mb-3 300:ml-10 w-[50%] "
          style={{ marginLeft: currentBall * moveValue + "px" }}
        >
          <span className="sm:text-sm ml-10  300:text-xs  md:text-lg 300:ml-6">
            run scored
          </span>
        </div>
        <div
          className={`control-container 300:mt-1 350:w-[50%] flex 300:w-[50%] 320:mt-3 sm:mt-5  transition-all lg:w-[33%] xl:w-[33%]  375:w-[60%] 390:w-[65%] 425:w-[60%] 585:w-[45%] 608:w-[40%] 560:w-[40%] 500:w-[50%] flex-wrap h-fit 300:py-2  mt-10 sm:w-[40%] sm:-ml-2   justify-items-end px-4 border-dashed border-2 border-red-400`}
          style={{ marginLeft: currentBall * moveValue + "px" }}
        >
          {op.map((value, index) => {
            let color = value !== "abc" ? colors[value].color : "";
            let textColor = value !== "abc" ? colors[value].text : "";

            return (
              <button
                disabled={wickets == 10}
                key={value}
                className={`flex bg-gray-500  items-center text-${textColor} mx-auto justify-center mb-2 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 border  border-black rounded-full focus:outline-none 0`}
                onClick={() => handleRunsOrWickets(value)}
                style={{
                  backgroundColor: color,
                }}
              >
                <span>{value}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminControl;
