import React from 'react';
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Rightbar2 from "../../components/rightbar/Rightbar2";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useMediaQuery } from 'react-responsive';
import {regSw, subscribe} from '../../helper.js';
import './home.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import TimeMe from "timeme.js";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useHistory } from "react-router";
import { useLocation } from 'react-router-dom';


function Home() {
  const history = useHistory();
    const [selectedValue, setSelectedValue] = useState('0');
    const [searchTerm, setSearchTerm] = useState("");
    const [shouldSendEvent, setShouldSendEvent] = useState(false);
    const [shouldSendAlert, setShouldSendAlert] = useState(true);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    var location = useLocation();
    const [webViewVisible, setWebViewVisible] = useState(false);
    const [actionTriggered, setActionTriggered] = useState(false);
    const [hasReadArticle, setHasReadArticle] = useState(false);
    const [currentRound, setCurrentRound] = useState(1); // Start with round 1
    

    const [day_One_Percent, setDay_One_Percent] = useState(0);
    const [day_Two_Percent, setDay_Two_Percent] = useState(0);
    const [day_Three_Percent, setDay_Three_Percent] = useState(0);
    const [day_Four_Percent, setDay_Four_Percent] = useState(0);
    const [day_Five_Percent, setDay_Five_Percent] = useState(0);
    const currentAlertRef = useRef(null);
    
    const [isFirstVisit_FirstAlert, setIsFirstVisit_FirstAlert] = useState(true);
    const [isFirstVisit_SecondAlert, setIsFirstVisit_SecondAlert] = useState(true);
    const [isFirstVisit_ThirdAlert, setIsFirstVisit_ThirdAlert] = useState(true);

    const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
    const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });

    let toastId = null;
    let lastAlertType = null;
    let toastId2 = null;
    let toastId3 = null;
    const toastIdRef = useRef(null);
    
    let intervalId = null;
    
    
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    
    //console.log(TimeMe.getTimeOnCurrentPageInSeconds());

    const token = localStorage.getItem('token');
    const handleActivityRecorder = () => {
        axios.put("/users/" + currentUser._id + "/activity", { page: "Home", seconds: TimeMe.getTimeOnCurrentPageInSeconds(), headers: { 'auth-token': token } });
    };

    const onQuestionAction = () => {
            console.log("onQuestionAction triggered from Topbar!");
            toast.success("Hvala vam na učešću. Molimo vas da pročitate objave ispod. Možete da reagujete na bilo koju objavu kao što biste to inače radili na društvenim mrežama, uključujući lajkovanje i komentarisanje. Takođe, pročitajte bilo koju vest na koju vode linkovi unutar objava. Kada pročitate bar jednu vest i reagujete na bar jednu objavu (tako što ćete lajkovati, dislajkovati ili komentarisati), pritisnite dugme \"Osveži fid\" na vrhu stranice, i sadržaj biti ažuriran. Ovaj proces će se ponoviti nekoliko puta. Nakon toga bićete preusmereni na izlaznu anketu.");
            
    }

    const handleActionFromTopbar = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/users/${currentUser._id}/getUserActionsRefresh`, { headers: { "auth-token": token }, });
      console.log("API Response:", res.data);
      const newAlert = res.data["showAlert"];
      
      if (newAlert === "third") {
        //setHasReadArticle(true);
        setActionTriggered(true);
      
      } else if (newAlert === "final") {
        showToast(
          "Hvala vam na učešću. Sada možete nastaviti sa korišćenjem sadržaja ako želite. Kada budete spremni, molimo vas da pređete na završnu anketu klikom ovde.",
          "success-toast",
          handleNotificationClick
        );
      
      }
      else {
        toast.success("Hvala vam na učešću. Molimo vas da pročitate objave ispod. Možete da reagujete na bilo koju objavu kao što biste to inače radili na društvenim mrežama, uključujući lajkovanje i komentarisanje. Takođe, pročitajte bilo koju vest na koju vode linkovi unutar objava. Kada pročitate bar jednu vest i reagujete na bar jednu objavu (tako što ćete lajkovati, dislajkovati ili komentarisati), pritisnite dugme \"Osveži fid\" na vrhu stranice, i sadržaj biti ažuriran. Ovaj proces će se ponoviti nekoliko puta. Nakon toga bićete preusmereni na izlaznu anketu.");
        return;
      }
 
      setTimeout(() => {
        setActionTriggered(false);
    }, 5000);
      //setCurrentRound(prevRound => prevRound + 1);
  };

    useEffect(() => {
       
        //TimeMe.initialize({
         //   currentPageName: "HomePage", // current page
          //  idleTimeoutInSeconds: 10 // seconds
          //});
      
          //TimeMe.callWhenUserLeaves(() => {
           // setShouldSendEvent(true);
            //handleActivityRecorder();
          //});
        
          //TimeMe.callWhenUserReturns(() => {
          //setShouldSendEvent(false);
          
          //});

          //if(shouldSendAlert) {
          
            //const hasVisited_1 = localStorage.getItem("hasVisitedFirstAlert");
            
            //var delay = (hasVisited_1=="true" && hasVisited_1!= null) ? 60000 : 10000;
            
            //console.log("hasVisited_1")
            //console.log(hasVisited_1)
            
            //if (hasVisited_1=="true") {
            //const totLk = parseInt(localStorage.getItem("totalLikes"));
            //console.log("totalLikes")
            //console.log(totLk)
            
           // var found = false
           // var bothfound = false
            
           // if(!totLk){ 
           //   localStorage.setItem("totalLikes", 0);
           // }
            
            //if(totLk){ 
            //  delay = totLk>2 ? 10000 : 60000; 
            //  found = totLk>2 ? true : false; 
            //  }
            
            //if(found == "false"){
            //const totDLk = parseInt(localStorage.getItem("totalDisLikes"));
            //console.log("totalDisLikes")
            //console.log(totDLk)
            
           // if(!totDLk){ 
            //  localStorage.setItem("totalDisLikes", 0);
           // }
          
            
           // if(totDLk){ 
            //  delay = totDLk>2 ? 10000 : 60000;
            //  bothfound = totDLk>2 ? true : false; 
            //}
          //}
            
            //if(found || bothfound){
            //  const totalComments = localStorage.getItem("totalComments");
            //  console.log("totalComments")
             // console.log(totLk)
            
            
            //if(totalComments){  
            //  delay = totalComments>2 ? 10000 : 60000; 
            //}
            //}
            
            //console.log("delay")
            //console.log(delay)
            //if(hasVisited_1=="false") {
             // console.log(hasVisited_1)
              //localStorage.setItem("hasVisitedFirstAlert", "true");
            //}
            //console.log("hasVisited_1")
            //console.log(hasVisited_1)
            fetchTimeSpent2(location.pathname);
            
            //const intervalId = setInterval(() => fetchTimeSpent2(location.pathname), 10000);
            //return () => clearInterval(intervalId);
            
            //setInterval(() => fetchTimeSpent2(location.pathname), 20000);
            //fetchTimeSpent2(location.pathname);
          //}
      
        }, [location.pathname]);

        const handleNotificationClick = () => {
          history.push(`/postsurvey/${currentUser.username}`);
        };
        
        const fetchTimeSpent = async () => {
          const token = localStorage.getItem('token');
            const res = await axios.get("/users/" + currentUser._id + "/getTimeSpent", {headers: { 'auth-token': token }})
            console.log(res.data);
            setDay_One_Percent(calculatePercentage(res.data["today"], 16));
            setDay_Two_Percent(calculatePercentage(res.data["oneDayBefore"], 16));
            setDay_Three_Percent(calculatePercentage(res.data["twoDayBefore"], 16));
            setDay_Four_Percent(calculatePercentage(res.data["threeDayBefore"], 16));
            setDay_Five_Percent(calculatePercentage(res.data["fourDayBefore"], 16));

            
               if(calculatePercentage(res.data["today"], 16)> 50 && calculatePercentage(res.data["oneDayBefore"], 16) > 50 && calculatePercentage(res.data["twoDayBefore"], 16) > 50){
                    //toast.success("Herzlichen Glückwunsch!!! Sie sind jetzt berechtigt, an der Nachbefragung teilzunehmen.",{onClick: handleNotificationClick});
                    setShouldSendAlert(false)
                }
            
                if(res.data["not"] == "yes"){
                  //toast.success("Denken Sie daran, dass Sie unser System an 10 Minuten pro Tag nutzen müssen um Ihre Vergütung zu erhalten");
              }
          };
        
          const fetchTimeSpent2 = async (pathname) => {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/users/${currentUser._id}/getUserActions`, {
              headers: { "auth-token": token },
            });
        
            console.log("API Response:", res.data);
        
            if (pathname !== "/") {
              console.log("Not on the home screen, skipping alerts.");
              return;
            }
        
            const newAlert = res.data["showAlert"];
            console.log("New Alert:", newAlert);
            console.log("Current Alert:", currentAlertRef.current);
        
            if (currentAlertRef.current === null || newAlert !== currentAlertRef.current) {
              console.log(
                currentAlertRef.current === null
                  ? "Initial alert display."
                  : "Alert type changed, updating..."
              );
            
              if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current); // Dismiss the previous toast
                fetchTimeSpent2(location.pathname);
                console.log("Previous toast dismissed.");
              }
            
              currentAlertRef.current = newAlert; // Update the current alert state
        
              if (newAlert === "first") {
                showToast(
                  "Bitte markieren Sie mindestens zwei dieser Beiträge mit „Gefällt mir“ oder „Gefällt mir nicht“, so wie Sie es üblicherweise tun würden.",
                  "success-toast"
                );
              } else if (newAlert === "second") {
                showToast(
                  "Dankeschön. Jetzt möchten wir Sie bitten, sich an der Diskussion zu beteiligen, indem Sie mindestens drei der Beiträge kommentieren.",
                  "success-toast"
                );
              } else if (newAlert === "third") {
                showToast(
                  "Hvala vam na učešću. Sada možete nastaviti sa korišćenjem sadržaja ako želite. Kada budete spremni, molimo vas da pređete na završnu anketu klikom ovde.",
                  "success-toast",
                  handleNotificationClick
                );
              }
            } else {
              console.log("Alert type is the same, keeping the current alert on screen.");
            }
          };
        
          const handleSecondAlertClose = () => {
            console.log("currentAlertRef.current:", currentAlertRef.current);
            currentAlertRef.current = null;
          };
        
          const showToast = (message, toastId, onClick = null) => {
            toastIdRef.current = toast.success(message, {
              closeOnClick: true,
              onClose: () => handleSecondAlertClose(),
              closeButton: true,
              autoClose: false,
              toastId,
              onClick,
            });
            console.log("Alert displayed:", message);
          };
        
          const fetchTimeSpent3 = async (pathname) => {
          
            const token = localStorage.getItem('token');
            const res = await axios.get("/users/" + currentUser._id + "/getUserActions", {headers: { 'auth-token': token }})
            console.log(res.data);
            
            const scheduleNextCall = (delay, pathname) => {
              if (intervalId) clearInterval(intervalId); // Clear any existing interval
              intervalId = setInterval(() => fetchTimeSpent2(pathname), delay); // Schedule with the new interval
            };
            
            const handleAlertClose = (nextDelay) => {
              scheduleNextCall(nextDelay, location.pathname);
            };
            
            console.log(pathname)
            console.log(" pathname")
            
            if ( pathname !== "/") {
              console.log("Not on the home screen, skipping alerts.");
              return; // Exit early if not on the home screen
            }
            
              
                 if(res.data["showAlert"] == "third"){
                  if (!toast.isActive(toastId)) { 
                    if ( pathname === "/") {
                    
                      toastId = toast.success("Hvala vam na učešću. Sada možete nastaviti sa korišćenjem sadržaja ako želite. Kada budete spremni, molimo vas da pređete na završnu anketu klikom ovde.", { closeOnClick: true, closeButton: true, autoClose: false, toastId: 'success-toast', onClick: handleNotificationClick});//,onClose: () => handleAlertClose(20000)
                          //});
                      //toastId.success("you may proceed to the post-survey",{onClick: handleNotificationClick});
                      setShouldSendAlert(false)
                    }
                  }
                }
                  
                  if(res.data["showAlert"] == "first"){
                    if (!toast.isActive(toastId)) {
                     
                      if ( pathname === "/") {
                        const hasVisited_1 = localStorage.getItem("hasVisitedFirstAlert");
                        if(!hasVisited_1) {  
                          localStorage.setItem("hasVisitedFirstAlert", "true");
                        }
                      toastId = toast.success("Willkommen! Bitte lesen Sie die Beiträge und markieren Sie mindestens zwei dieser Beiträge mit „Gefällt mir“ oder „Gefällt mir nicht“, so wie Sie es üblicherweise tun würden.", { closeOnClick: true, closeButton: true, autoClose: false,toastId: 'success-toast'});//, onClose: () => handleAlertClose(20000) });
                      
                      //("Welcome to the TWON platform, please browse and interact with the content shown here as you normally would on a social media platform. First, we would like you to read each of the posts and then like at least two of these posts. Additionally, we would like you to join the conversation by commenting with your reactions on at least three of the posts.", { autoClose: 30000,toastId: 'success-toast'});
                      //toast.success("Welcome to the TWON platform, please browse and interact with the content shown here as you normally would on a social media platform. First, we would like you to read each of the posts and then like at least two of these posts. Additionally, we would like you to join the conversation by commenting with your reactions on at least three of the posts.");
                }}
                }
                
                if(res.data["showAlert"] == "second"){
                  if (!toast.isActive(toastId)) { 
                    if ( pathname === "/") {
                    toastId = toast.success("Dankeschön. Jetzt möchten wir Sie bitten, sich an der Diskussion zu beteiligen, indem Sie mindestens drei der Beiträge kommentieren.", { closeOnClick: true, closeButton: true, autoClose: false, toastId: 'success-toast'});//, onClose: () => handleAlertClose(20000)
                      };
                    
                    //("Welcome to the TWON platform, please browse and interact with the content shown here as you normally would on a social media platform. First, we would like you to read each of the posts and then like at least two of these posts. Additionally, we would like you to join the conversation by commenting with your reactions on at least three of the posts.", { autoClose: 30000,toastId: 'success-toast'});
                    //toast.success("Welcome to the TWON platform, please browse and interact with the content shown here as you normally would on a social media platform. First, we would like you to read each of the posts and then like at least two of these posts. Additionally, we would like you to join the conversation by commenting with your reactions on at least three of the posts.");
              }}
              };

          const calculatePercentage = (numerator, denominator) => {
            // Ensure denominator is not 0 to avoid division by zero error
            if (denominator !== 0) {
              const perct = (numerator/denominator) * 100
              console.log(numerator)
              console.log(denominator)
              console.log(perct)
              return (perct).toFixed(0);
            } else {
              return 'N/A';
            }
          };

    return (
        <>
        <ToastContainer autoClose={600000} style={{ 'width': !isMobileDevice && !isTabletDevice ? deviceWidth  :'500px'  }}></ToastContainer>
            <Topbar setSelectedValue={setSelectedValue} setSearchTerm={setSearchTerm} onAction={handleActionFromTopbar} showRefreshIcon={true} onAction2={onQuestionAction}/>
            <ToastProvider placement="top-center" style={{ 'margin': !isMobileDevice && !isTabletDevice && '0px 1px' }}>
            <div className="homeContainer" style={{ 'margin': !isMobileDevice && !isTabletDevice && '50px 1px' }}>
                { /*isMobileDevice && isTabletDevice && <Sidebar />*/}
                <Feed selectedValue={selectedValue} searchTerm={searchTerm} actionTriggered={actionTriggered} setHasReadArticle={setHasReadArticle} currentRound={currentRound}/>
                {/* isMobileDevice && isTabletDevice && <Rightbar2 />*/}
            </div>
            </ToastProvider>
        </>
    )
}

export default Home
