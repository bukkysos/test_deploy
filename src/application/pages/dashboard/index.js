import React, { 
  // useCallback,
  useContext, 
  useEffect, 
  // useState 
} from "react";
// import { useHistory } from "react-router-dom";
// import { Agent } from "end-user-activity-monitor";
import { Header, Sidebar } from "../../../widgets";
import { MainContent } from "../../../widgets/mainContent";
import "./dashboard.css";
import {
  AppContext,
  HeaderIconProvider,
  SidebarContext,
} from "../../../appContext";

// let countDownTimer;
// let countDownTime = 30 * 60000
//   let warningTime = 20 * 60000;

const Dashboard = ({ children }) => {
  const [context] = useContext(AppContext);
  const [sidebarState, setSidebarState] = useContext(SidebarContext);
  // const [idleState, setIdleState] = useState(false);
  // const [counter, setCounter] = useState(countDownTime);
  // const [warning, setWarning] = useState(false);

  // const history = useHistory();

  // const activityDetectorAgent = new Agent({ idleInterval: 5000 });

  // const logout = useCallback(() => {
  //   localStorage.removeItem("data");
  //   localStorage.removeItem("accessToken");
  //   history.push("/");
  // }, [history]);

  // const countDown = useCallback(() => {
  //   countDownTimer = setTimeout(() => {
  //     setCounter(counter - 1);
  //   }, 1000);
  //   if (counter === warningTime) {
  //     setWarning(true);
  //   }
  //   if (counter === 0) {
  //     logout();
  //   }
  // }, [counter, logout]);

  // useEffect(() => {
  //   if (idleState) {
  //     countDown();
  //   } else {
  //     setCounter(countDownTime);
  //     clearTimeout(countDownTimer);
  //   }
  // }, [countDown, idleState]);

  // useEffect(() => {
  //   activityDetectorAgent.startMonitor();
  //   activityDetectorAgent.activityObservable().subscribe((status) => {
  //     if (status === "idle") {
  //       setIdleState(true);
  //     } else {
  //       setIdleState(false);
  //     }
  //   });
  // });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https:////code.tidio.co/6fn3wrk925lpvslyneqrnzdlrbqtxsc3.js";
    script.async = true;
    script.onload = () => console.log("Loaded....");
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* {warning ? (
        <div
          className="timeout_alert alert alert-danger alert-dismissible fade show text-center"
          role="alert"
        >
          <strong>Still there?</strong> You will soon be logged out due to
          inactivity. Move mouse, click, or press a key to continue.
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => {setWarning(false)}}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      ) : (
        <></>
      )} */}

      <HeaderIconProvider>
        <div className={`d-flex justify-content-center p-0 dashboard_wrapper`}>
          <div
            className={`dashboard_sidebar_overlay ${
              sidebarState ? "show_sidebar" : "hide_sidebar"
            }`}
            onClick={() => setSidebarState(false)}
          ></div>
          <div
            className={`dashboard_sidebar ${context ? "blur" : ""} ${
              sidebarState ? "show_sidebar" : "hide_sidebar"
            }`}
          >
            <Sidebar />
          </div>

          <div className="dashboard_right_container">
            <div className={`${context ? "blur" : ""} p-0 m-0`}>
              <Header />
            </div>
            <MainContent children={children} />

            {/* <div
              className={`dashboard_support d-flex justify-content-between align-content-center py-2 px-4 ${
                context ? "blur" : ""
              }`}
            >
              <SupportIcon />
              <p className="p-0 my-auto">Support</p>
            </div> */}
          </div>
        </div>
      </HeaderIconProvider>
    </>
  );
};

export { Dashboard };
