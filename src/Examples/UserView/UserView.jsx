import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { socket } from "../../Socket";
import colors from "../../assets/colors";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserView = () => {
  const [overData, setOverData] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentBall, setCurrentBall] = useState(0);
  const [overNo, setOverNo] = useState(0);
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);

  // Fetch match data from API
  const getMatchDataFromDB = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const matchId = localStorage.getItem("matchId");

      if (!matchId) {
        throw new Error("No match ID found in local storage.");
      }

      const response = await fetch(`${apiUrl}/getMatchData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          id: matchId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch match data.");
      }

      const json = await response.json();

      if (json.success) {
        const { totalRuns, totalWickets, ballNo, overNo, currentOver } = json.matchData;
        setRuns(totalRuns);
        setWickets(totalWickets);
        setCurrentBall(ballNo);
        setOverNo(overNo);
        setOverData(currentOver);
      } else {
        localStorage.removeItem("matchId");
        throw new Error("Match data retrieval failed.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get match ID from server
  const getMatchId = () => {
    const matchId = localStorage.getItem("matchId");
    if (matchId) {
      getMatchDataFromDB();
    } else {
      socket.emit("getmatchId");
    }
  };

  // Reset all states
  const emptyStates = () => {
    setCurrentBall(0);
    setOverData({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
    setWickets(0);
    setRuns(0);
    setOverNo(0);
  };

  useEffect(() => {
    socket.on("connect", () => {
      getMatchId();
    });

    socket.on("id", (data) => {
      if (data) {
        localStorage.setItem("matchId", data);
        getMatchDataFromDB();
      }
    });

    socket.on("loading", (isLoading) => setLoading(isLoading));

    socket.on("score", (data) => {
      setLoading(false);
      const matchId = localStorage.getItem("matchId");

      if (!matchId) {
        localStorage.setItem("matchId", data.matchId);
      }

      if (data.matchId !== matchId) {
        localStorage.setItem("matchId", data.matchId);
        emptyStates();
      }

      if (data.value === "Out") {
        setWickets((prev) => prev + 1);
      } else {
        setRuns((prev) => prev + data.value);
      }

      setCurrentBall(data.currentBall + 1);
      setOverData((prev) => ({
        ...prev,
        [data.currentBall]: data.value,
      }));

      if (data.currentBall === 5) {
        setCurrentBall(0);
        setOverNo((prev) => prev + 1);
      }

      if (data.overFinished) {
        setTimeout(() => {
          setOverData({ 0: "", 1: "", 2: "", 3: "", 4: "", 5: "" });
        }, 2000);
      }
    });

    socket.on("startingNewMatchToUser", () => {
      localStorage.removeItem("matchId");
      emptyStates();
      toast.success("Starting New Match !!", {
        position: "bottom-right",
      });
    });

    return () => {
      socket.off("connect");
      socket.off("id");
      socket.off("loading");
      socket.off("score");
      socket.off("startingNewMatchToUser");
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="user-container h-fit sm:w-[100%] md:w-[60%] 405:w-[100%] w-[100%] 300:w-[105%] mx-auto border border-black">
        <Header runs={runs} wickets={wickets} currentBall={currentBall} overNo={overNo} />
        <div className="animation-container mt-6 mb-6 py-2 h-30">
          <div className="animation-content h-28 sm:w-[40%] 300:w-[40%] justify-center border-[10px] border-yellow-300 mx-auto">
            {loading ? <div className="loader mx-auto mt-7"></div> : ""}
            {wickets === 10 ? <span className="mt-10">Match is Over</span> : ""}
          </div>
        </div>
        <div className="flex justify-between sm:w-[90%] md:w-[90%] 405:w-[80%] 560:w-[95%] 450:w-[70%] 524:w-[65%] lg:w-[83%] w-[83%] 300:w-[90%] mx-auto flex-wrap border p-4 border-black mb-4">
          {Object.keys(overData).map((key) => {
            let value = overData[key];
            let color = value === "" ? "white" : colors[value]?.color || "white";
            let textColor = value === "" ? "black" : colors[value]?.text || "black";

            return (
              <div
                key={key}
                className={`flex items-center text-${textColor} ${currentBall == key ? "border-yellow-400 border-[8px]" : ""
                  } justify-center w-14 h-14 border border-black rounded-full sm:mb-0 mb-2 sm:mx-0 mx-2 transition-transform transform hover:scale-110 shadow-lg`}
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
    </>
  );
};

export default UserView;
