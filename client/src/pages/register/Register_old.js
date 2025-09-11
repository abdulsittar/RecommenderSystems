import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './registerPageStyle'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { render } from "react-dom";
import axios from "axios";
import TimeMe from "timeme.js";
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import LoadingBar from "react-top-loading-bar";

import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'; 
import { useScrollBy } from "react-use-window-scroll";
import {  AlertDialog,  AlertDialogLabel,  AlertDialogDescription,  AlertDialogOverlay,  AlertDialogContent,} from "@reach/alert-dialog";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import {
  // New constants for three-stage survey
  CONSENT_WELCOME,
  CONSENT_INTRODUCTION,
  CONSENT_QUESTIONS,
  CONSENT_AGREE,
  CONSENT_DISAGREE,
  ONETIME_INTRO,
  DEMO_AGE,
  DEMO_GENDER,
  DEMO_GENDER_OPTIONS,
  DEMO_EDUCATION,
  DEMO_EDUCATION_OPTIONS,
  DEMO_EMPLOYMENT,
  DEMO_EMPLOYMENT_OPTIONS,
  POLITICS_INTEREST,
  SOCIAL_MEDIA_USAGE,
  WEEKLY_INTRO,
  WEEKLY_NEWS_CONSUMPTION,
  WEEKLY_MOOD,
  WEEKLY_POLITICAL_DISCUSSIONS,
  BTN_NEXT,
  BTN_PREVIOUS,
  BTN_SUBMIT,
  BTN_CONTINUE,
  PROGRESS_CONSENT,
  PROGRESS_DEMOGRAPHICS,
  PROGRESS_WEEKLY,
  ERROR_REQUIRED_FIELD,
  ERROR_INVALID_AGE,
  ERROR_NETWORK,
  SUCCESS_CONSENT,
  SUCCESS_DEMOGRAPHICS,
  SUCCESS_WEEKLY,
  // Legacy constants
  followers,
  followings,
  email,
  Password,
  Send,
  comments,
  Write_something,
  A_user_with,
} from '../../constants_STA';
import { Unstable_Grid2 } from '@mui/material';

function Register({classes}) {
  const history = useHistory();
  const scrollBy = useScrollBy();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const {user, isFetching, error, dispatch} = useContext(AuthContext);
  
  // Core survey state
  const [currentStage, setCurrentStage] = useState('consent'); // 'consent', 'demographics', 'weekly'
  const [uniqId, setUniqId] = useState('');
  
  // Form data state
  const [consentAnswers, setConsentAnswers] = useState([]);
  const [demographicsData, setDemographicsData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});
  
  // UI state
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const cancelRef = React.useRef();

  // User account state (keep these for account creation flow)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [proPic, setProPic] = useState("");
  
  const initialized = useRef(false);

  useEffect(() => {
    // Extract unique ID from URL
    const urlParts = window.location.pathname.split('/');
    const uniqueId = urlParts[urlParts.length-1];
    setUniqId(uniqueId);
    
    // Check if user has already submitted survey
    checkUserSurveyStatus(uniqueId);
  }, []);

  // Helper functions
  const getRandomNumber = () => Math.floor(Math.random() * 4) + 1;
  
  const checkUserSurveyStatus = async (val) => {
    try {
      setProgress(30);
      const token = localStorage.getItem('token');
      const res = await axios.post(`/presurvey/isSubmitted/${val}`,{ headers: { 'auth-token': token }}); 
      console.log(res);
      console.log(res.data);
      if(res.data == ""){ 
        setIsVisibleBasic(false);
        setIsVisibleSignUp(false);
        setProgress(100);
      } else {
      console.log(res.data.data);
      setIsSurveyChecked(false);
      console.log(isSurveyChecked);
      setIs_review_is_onward(false);
      setUniqId(val);

      if(res.data.login == true){
        const urlParts = window.location.pathname.split('/');
        const valu = urlParts[urlParts.length-1]
        history.push(`/login/${valu}`);
        setProgress(100);

      } else if(res.data.data == true){
      
        console.log(res.data.users[0])
        
        //const usr1 = Buffer.from(res.data.users[0], 'latin1').toString('utf8');
        //const usr2 = Buffer.from(res.data.users[1], 'latin1').toString('utf8');
        //const usr3 = Buffer.from(res.data.users[2], 'latin1').toString('utf8');
        //const usr4 = Buffer.from(res.data.users[3], 'latin1').toString('utf8');
        
        const usr1 =  res.data.users[0]["user"] 
        
        console.log(usr1["user"])
        
        const usr2 =  res.data.users[1]["user"]
        const usr3 =  res.data.users[2]["user"] 
        const usr4 =  res.data.users[3]["user"] 
        
        const users = [usr1, usr2, usr3, usr4];
        
        console.log(users)
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        
        const shuffledUsers = shuffleArray(users);
        console.log(shuffledUsers);


        const fixSpecialCharacters = (text) => {
          if (!text) return '';
          
          // Debug: Log the exact text we're getting to see character codes
          console.log("Original text:", text);
          console.log("Character codes:", Array.from(text).map(c => c.charCodeAt(0)));
          
          // Case insensitive regex for Roze P ela that's more forgiving of spaces
          if (/roze\s*p\s*ela/i.test(text)) {
            return 'Roze Pčela';
          }
          
          // First handle specific complete usernames
          if (text === 'Crni Je~' || text === 'Crni Je%7E') return 'Crni Jež';
          if (text === 'Roze P ela') return 'Roze Pčela';
          if (text === 'Siva Orka') return 'Siva Orka';  // Already correct
          if (text === 'Plavo Pile') return 'Plavo Pile';  // Already correct
          
          // Then apply general character replacements
          return text
            .replace(/~/g, 'ž')           // Replace tilde with ž
            .replace(/Je~/g, 'Jež')       // Fix specifically Je~
            .replace(/Roze P\s*ela/g, 'Roze Pčela')   // More flexible pattern
            .replace(/P\s+ela/g, 'Pčela')   // More flexible pattern for P ela
            .replace(/P /g, 'Pč')         // More general case for P+space
            .replace(/%7E/g, 'ž')         // URL-encoded tilde
            .replace(/\u00A0/g, 'č')      // Replace non-breaking space with č
            .replace(/\u0020ela/g, 'čela') // Replace space+ela with čela
            .replace(/\+/g, 'č')          // Some systems encode č as +
            .replace(/Ä/g, 'č')           // Common encoding issue
            .replace(/Ä\u008D/g, 'č')     // Another possible encoding
            .replace(/c\u030C/g, 'č');    // c with caron
        };

        const fixSpecialCharacters45 = (text) => {
          if (!text) return '';
          
          // Debug: Log the exact text we're getting to see character codes
          console.log("Original text:", text);
          console.log("Character codes:", Array.from(text).map(c => c.charCodeAt(0)));
          
          // Case insensitive regex for Roze P ela that's more forgiving of spaces
          if (/roze\s*p\s*ela/i.test(text)) {
            return 'Roze Pčela';
          }
          
          // First handle specific complete usernames
          if (text === 'Crni Je~' || text === 'Crni Je%7E') return 'Crni Jež';
          if (text === 'Roze P ela') return 'Roze Pčela';
          if (text === 'Siva Orka') return 'Siva Orka';  // Already correct
          if (text === 'Plavo Pile') return 'Plavo Pile';  // Already correct
          
          // Then apply general character replacements
          return text
            .replace(/~/g, 'ž')           // Replace tilde with ž
            .replace(/Je~/g, 'Jež')       // Fix specifically Je~
            .replace(/Roze P\s*ela/g, 'Roze Pčela')   // More flexible pattern
            .replace(/P\s+ela/g, 'Pčela')   // More flexible pattern for P ela
            .replace(/P /g, 'Pč')         // More general case for P+space
            .replace(/%7E/g, 'ž')         // URL-encoded tilde
            .replace(/\u00A0/g, 'č')      // Replace non-breaking space with č
            .replace(/\u0020ela/g, 'čela') // Replace space+ela with čela
            .replace(/\+/g, 'č')          // Some systems encode č as +
            .replace(/Ä/g, 'č')           // Common encoding issue
            .replace(/Ä\u008D/g, 'č')     // Another possible encoding
            .replace(/c\u030C/g, 'č');    // c with caron
        };
        
        setProfPic1(`${shuffledUsers[0].profilePicture}`);
        setUsrName1(fixSpecialCharacters(Buffer.from(shuffledUsers[0].username, 'latin1').toString('utf8')));
        setVersion1(`${shuffledUsers[0].version}`);
        console.log(version1);

        setProfPic2(`${shuffledUsers[1].profilePicture}`);
        setUsrName2(fixSpecialCharacters(Buffer.from(shuffledUsers[1].username, 'latin1').toString('utf8')));
        setVersion2(`${shuffledUsers[1].version}`);
        console.log(version2);

        setProfPic3(`${shuffledUsers[2].profilePicture}`);
        setUsrName3(fixSpecialCharacters(Buffer.from(shuffledUsers[2].username, 'latin1').toString('utf8')));
        setVersion3(`${shuffledUsers[2].version}`);
        console.log(version3);

        setProfPic4(`${shuffledUsers[3].profilePicture}`);
        setUsrName4(fixSpecialCharacters(Buffer.from(shuffledUsers[3].username, 'latin1').toString('utf8')));
        setVersion4(`${shuffledUsers[3].version}`);
        console.log(version4);
         
        setOriginalName(Buffer.from(shuffledUsers[3].username_second, 'latin1').toString('utf8'));

        
        //console.log(usr1);
        //setProfPic1(`${usr1.profilePicture}`);
        //setUsrName1(usr1.username);
        //setVersion1(`${usr1.version}`);
        //console.log(version1);


        //setProfPic2(`${usr2.profilePicture}`);
        //setUsrName2(usr2.username);
        //setVersion2(`${usr2.version}`);
        //console.log(version2);

        //setProfPic3(`${usr3.profilePicture}`);
        //setUsrName3(usr3.username);
        //setVersion3(`${usr3.version}`);
        //console.log(version3);
        
        //setProfPic4(`${usr4.profilePicture}`);
        //setUsrName4(usr4.username);
        //setVersion4(`${usr4.version}`);
        //console.log(version4);

        setPassword4(usr1.password);

        setIsVisibleBasic(false);
        setIsVisibleConsent(false);
        setIsVisibleSignUp(true);
        setIs_Post_visible(false);
        setIsVisibleBasicInfo(false);
        setProgress(100);

      }else{

        setIsVisibleBasic(true);
        setProgress(100);
        
      }
      }
    } catch (err) {
      console.log(err);
      setPasswordErr({A_user_with});
      setProgress(100);

    }
    // if not submitted the survey
        //show third block

    // if submitted the survey, check if user registered

    };

    const fadeInOut = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  const fadeOut = keyframes`
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  `;
  
  // Styled component with dynamic animation
  const AnimatedDiv = styled.div`
    &.fade-enter {
      animation: ${fadeInOut} 1s forwards;
    }
    &.fade-exit {
      animation: ${fadeOut} 1s forwards;
    }`;
    
    const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
`;

/*const SlideDiv = styled.div`
  &.slide-enter {
    animation: ${slideIn} 1s forwards;
    animation-fill-mode: forwards;
  }
  &.slide-exit {
    animation: ${slideOut} 1s forwards;
    animation-fill-mode: forwards;
  }
`;*/

const SlideDiv = styled.div`
  &.slide-enter {
    animation: ${slideIn} 1s forwards;
    opacity: 0;
  }
  &.slide-enter-active {
    animation: ${slideIn} 1s forwards;
    opacity: 1;
  }
  &.slide-exit {
    animation: ${slideOut} 1s forwards;
    opacity: 1;
  }
  &.slide-exit-active {
    animation: ${slideOut} 1s forwards;
    opacity: 0;
  }
`;
    


    const handle_Confirm_Changed = async (e) => { 
      stValue_confirmation(e.target.value);
      const pass = document.getElementById('password').value;
      setPassword(pass)
      
      if(e.target.value == "option1"){
        setIs_password_visible(false);
        setIsWelcomeVisible(true);
        
      } else {
        setIsWelcomeVisible(false);
        setIs_password_visible(true);
      } 
  };
  
  const disableDivState = (divId) => {
    const div = document.getElementById(divId);
    
    if (div) {
      div.style.pointerEvents =  'none';  // Disable/enable interaction
      div.style.opacity =  0.5 ; // Optional: dim the content when disabled
    }
  };
  
  const enableDivState = (divId) => {
    const div = document.getElementById(divId);
    
    if (div) {
      div.style.pointerEvents =  'auto';  // Disable/enable interaction
      div.style.opacity =  1; // Optional: dim the content when disabled
    }
  };
  
  
  const handle_Q0_Changed = async (e) => { 
    stValue_q0(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value == "option1"){
      //setIsVisibleConsent(true);
      
      
      setIs_Q1_visible(true);
      setIs_review_is_onward(true);
      setIs_Q2_visible(false);
      setIs_Q3_visible(false);
      setIs_Q4_visible(false);
      disableDivState('Q2');
      disableDivState('Q3');
      disableDivState('Q4');
      setIsVisibleBasicInfo(false);
      setIsVisibleBasic(false)
    
      
      setIs_Q5_visible(false);
      setIs_Q6_visible(false);
      setIs_Q7_visible(false);
      setIs_Q8_visible(false);
      setIs_Q9_visible(false);
      setIs_Q10_visible(false);
      setIs_TestingFeedBack_visible(false); 
      setIs_dank_visible(false);
      //scrollBy({ top: 1000, left: 0, behavior: "smooth" })

    } else if(e.target.value == "option2"){
  
      setIsVisibleBasicInfo(false);   
      setIs_Q1_visible(false);
      setIs_review_is_onward(false);
      setIs_Q2_visible(false);
      setIs_Q3_visible(false);
      setIs_Q4_visible(false);
      enableDivState('Q2');
      enableDivState('Q3');
      enableDivState('Q4');
      setIs_Q5_visible(false);
      setIs_Q6_visible(false);
      setIs_Q7_visible(false);
      setIs_Q8_visible(false);
      setIs_Q9_visible(false);
      setIs_Q10_visible(false);
      setIs_TestingFeedBack_visible(false);
      setIs_dank_visible(true);
      alert("You are not eligible to proceed!");
    } 
  }
};


const handle_prolific_code = async (e) => { 
  if(e.target.value != ""){
    if (/^\d*$/.test(e.target.value)) {
      let value = e.target.value; 
      set_Prolific_Code(e.target.value)
      if(isUserReviewing == false){
         console.log("nothin")
      }
    }else{
      console.log("nothin")
    } 
    } else {
    
      set_Prolific_Code("")
      if(isUserReviewing == false){
        console.log("nothin")
      }
    
    }  };


const handle_feedback_Changed = async (e) => {
    setFeedback(e.target.value); 
}
  const handle_age_Changed = async (e) => {
    if(e.target.value != ""){
      if (/^\d*$/.test(e.target.value)) {
        setAge(e.target.value); 
      if(e.target.value > 17){
        setIs_Q2_visible(true);
        setIs_Q3_visible(true);
        setIs_Q4_visible(true);
      
        enableDivState('Q2');
        enableDivState('Q3');
        enableDivState('Q4');
      }
      }
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {  
      setAge(e.target.value); 
      disableDivState('Q2');
      disableDivState('Q3');
      disableDivState('Q4');
      
      //setIs_Q2_visible(false);
    }
  };
  

  const handPostTextChange = async (e) => {
    if(e.target.value != ""){
      setIsPostButtonDisplays(false)
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIsPostButtonDisplays(true);

    }  
  };
  

  const handle_Q2_Changed = async (e) => { 
    stValue_q2(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value != "" && value_q3 != "" && value_q2 != "" ){
    
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      setIs_Q4_visible(false);
      setIs_Q3_visible(false);
      setIs_Q2_visible(false);
      setIs_Q1_visible(false);
      setIs_review_is_onward(false);
      setIsVisibleBasic(false);
      
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    }
    //scrollBy({ top: 500, left: 0, behavior: "smooth" })
    /*if(e.target.value != ""){
      setIs_Q3_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q3_visible(false);
    } */ 
    }
  };
  const handle_Q3_Changed = async (e) => { 
    stValue_q3(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value != "" && value_q4 != "" && value_q2 != "" ){
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      
      setIs_Q4_visible(false);
      setIs_Q3_visible(false);
      setIs_Q2_visible(false);
      setIs_Q1_visible(false);
      setIs_review_is_onward(false);
      
      setIsVisibleBasic(false);
      
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      //setIs_Q4_visible(false);
    }  
  }
  };

  const handle_Q4_Changed = async (e) => { 
    stValue_q4(e.target.value); 
    if(isUserReviewing == false){
    //scrollBy({ top: 500, left: 0, behavior: "smooth" })
    if(e.target.value != "" && value_q3 != "" && value_q2 != "" ){
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      
      setIs_Q4_visible(false);
      setIs_Q3_visible(false);
      setIs_Q2_visible(false);
      setIs_Q1_visible(false);
      setIs_review_is_onward(false);
      
      setIsVisibleBasic(false);
      
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q5_visible(false);
      setIs_Q6_visible(false);
    
      setIs_Q4_visible(true); 
      setIs_Q3_visible(true);
      setIs_Q2_visible(true);
      setIs_Q1_visible(true);
      setIs_review_is_onward(true);
      
      setIsVisibleBasic(false);
    } 
  }
    
    
  };
  const handle_Q5_Changed = async (e) => { 
    stValue_q5(e.target.value); 
    if(isUserReviewing == false){
    //scrollBy({ top: 500, left: 0, behavior: "smooth" });
    if(e.target.value != ""){
      setIs_Q6_visible(true);
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q6_visible(false);
    }
  }
  };
  
  const handle_age_Changed2 = async (e) => { 
    if(e.target.value != ""){
      if (/^\d*$/.test(e.target.value)) {
      let value = e.target.value;

      // Only allow numeric input and ensure it's not longer than two digits
       
        stValue_q6(e.target.value);
        
        setZipcode(e.target.value)
        if(isUserReviewing == false){
        setIs_Q6_visible(true);
        setIs_Q7_visible(true);
        setIs_Q8_visible(true);
        }
      }else{
      }
        //scrollBy({ top: 500, left: 0, behavior: "smooth" })
      } else {
      
        setZipcode("")
        if(isUserReviewing == false){
        setIs_Q6_visible(false);
      setIs_Q7_visible(false);
      setIs_Q8_visible(false);
        }
      
      }  };
      
  const handle_Q7_Changed = async (e) => { 
    stValue_q7(e.target.value); 
    if(e.target.value != ""){
      if(isUserReviewing == false){
      setIs_Q8_visible(true);
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })
      setIs_Q6_visible(false);
      setIs_Q5_visible(false);
      }

    } else {
      if(isUserReviewing == false){
      setIs_Q8_visible(false);
      }
    }
  };
  const handle_Q8_Changed = async (e) => { 
    stValue_q8(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value != ""){
    
      setIs_dank_visible(true);
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_dank_visible(false);
    }
  }
  };
  const handle_Q9_Changed = async (e) => { 
    stValue_q9(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value != ""){
      setIs_Q10_visible(true);
      
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q10_visible(false);
      setIs_TestingFeedBack_visible(false);
    }
  }
  };

  const handle_Q10_Changed = async (e) => { 
    stValue_q10(e.target.value); 
    if(isUserReviewing == false){
    if(e.target.value != ""){
      setIs_dank_visible(true);
      //scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_dank_visible(false);
    }
  }
    
  };

  const handle_Q11_Changed = async (e) => { 
    
    stValue_q11(e.target.value); 
    setIsNextDisplays(false);
    if(e.target.value == "option1"){
      setSelectedUserName(usrName1);
      setPassword(password)
      
      //handleClickOpen();

    }else if(e.target.value == "option2"){
      setSelectedUserName(usrName2);
      //handleClickOpen();

    }else if(e.target.value == "option3"){
      setSelectedUserName(usrName3);
      //handleClickOpen();

    }
  };


  const reviewButtonChanged = async (e) => { 
    e.preventDefault()
    if(value_q0 != "option2"){
    setIsUserReviewing(true);
    
      setIs_Q1_visible(true);
      setIs_review_is_onward(true);
      
      setIs_Q2_visible(true);
      setIs_Q3_visible(true);
      setIs_Q4_visible(true);
      enableDivState('Q2');
      enableDivState('Q3');
      enableDivState('Q4');
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      setIs_Q7_visible(true);
      setIs_Q8_visible(true); 
      setIs_TestingFeedBack_visible(false);
      
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }
  };

  const companyButtonChanged = async (e) => { 
    e.preventDefault()
    
    if(value_q0 != "option2"){
    //if(prolific_Code == ""){
    //  e.preventDefault()
    //  toast.error("Bitte geben Sie den Prolific-Code ein!");
     // return

 // }else 
 if(age == ""){
      e.preventDefault()
      toast.error("Frage 1. Bitte geben Sie Ihr Alter ein!");
      return
    }else if (age < 18){
      toast.error("Frage 1. Nur Personen ab 18 Jahren können teilnehmen. Bitte geben Sie Ihr Alter ein!");
    }else if (value_q2 == ""){
      e.preventDefault()
      toast.error("Frage 2. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
      return
    }else if (value_q3 == ""){
      e.preventDefault()
      toast.error("Frage 3. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
      return
    }else if (value_q4 == ""){
      e.preventDefault()
      toast.error("Frage 4. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
      return
    //}else if (value_q5 == ""){
    //  e.preventDefault()
    //  toast.error("Frage 5. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
    //  return
    }else if(zipcode == ""){
      e.preventDefault()
      toast.error("Frage 6. Bitte Postleitzahl eingeben!");
      return
    }
    else if (value_q7 == ""){
      e.preventDefault()
      toast.error("Frage 7. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
      return
    }else if (value_q8 == ""){
      e.preventDefault()
      toast.error("Frage 8. Bitte wählen Sie eine der vorgegebenen Möglichkeiten aus!");
      return
    }
  }
    /*else if (value_q9 == ""){
     % e.preventDefault()
     % toast.error("Question 9. Please select one given choice!");
      return
    }else if (value_q10 == ""){
      e.preventDefault()
      toast.error("Question 10. Please select one given choice!");
      return
    }*/
    
    const survey = {
      q1: age,
      q2: value_q2,
      q3: value_q3,
      q4: value_q4,
      q5: value_q5,
      q6: value_q6,
      q7: value_q7,
      q8: value_q8,
      q9: value_q9,
      q10: value_q10,
      //prolific_Code: prolific_Code,
      "feedback": feedback,

    };
  
        try {
          setProgress(30);
          console.log(survey);
          const res = await axios.post(`/presurvey/psurvey/${uniqId}`, survey);
          
          setButtonDisabled(true); 
          setIs_Q1_visible(false);
          setIs_review_is_onward(false);
          setIs_Q2_visible(false);
          setIs_Q3_visible(false);
          setIs_Q4_visible(false);
          setIs_Q5_visible(false);
          setIs_Q6_visible(false);
          setIs_Q7_visible(false);
          setIs_Q8_visible(false);
          setIs_Q9_visible(false);
          setIs_Q10_visible(false);
          setIs_TestingFeedBack_visible(false);
          setIs_dank_visible(false);
          if(value_q0 != "option2"){
            const urlParts = window.location.pathname.split('/');
            const valu = urlParts[urlParts.length-1]
            isUserAlreadySubmittedSurvey(valu);
            
          }else{
            setIsVisibleBasic(false);
          }
          setProgress(100);
        } catch (err) {
          console.log(err);
          setPasswordErr({A_user_with});
          setProgress(100);
  
        }
  };


  const handleKeyDown = (e) => {
    // Check for non-numeric characters (allowing backspace and delete keys)
    const key = e.key;
    if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Delete" && key !== "ArrowLeft" && key !== "ArrowRight") {
      e.preventDefault(); // Prevent the key press
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      // Perform your action here
      event.preventDefault();
      const usr = {
        username: username,
        password: password,
        "username_second":originalName,
        profilePicture: proPic,
        pool: version 
      };

      console.log(usr)
      const postText = document.getElementById('post').value;

      const token = localStorage.getItem('token');
      try {
        setProgress(30);
        const userRes = await axios.post(`/auth/register/${uniqId}`, usr)
        console.log(userRes.data);
        const user = userRes.data;
        console.log(user);
        console.log(user._id);
        console.log(postText);
        if(user){
          console.log("registered!!!");
          try {
            setProgress(30);
            const res2 = await axios.post(`/posts/${uniqId}/create/`, { userId: user._id, desc: postText, pool:user.pool, headers: { 'auth-token': token }});
            console.log(res2);
            //window.open('https://survey.maximiles.com/static-complete?p=123928_220ce61d', '_blank');
            // refresh the page after posting something
            //window.focus();
            try {
              setProgress(30);
              //await axios.post("/posts/" + user._id + "/createInitialData");
              await axios.post(`/posts/${uniqId}/createInitialData/`, { version: user.pool, userId: user._id, headers: { 'auth-token': token }});
               //await axios.post("/posts/create", newPost);
               // refresh the page after posting something
               //window.location.reload();
               dispatch({ type: "LOGIN_SUCCESS", payload: user });
              history.push("/");
     
             } catch (err) {
              setProgress(100);
             console.log(err);}
             
            
          } catch (err) {
            setProgress(100);
            console.log(err)
          }
        }
      } catch (err) {
        setPasswordErr("Error");
        setProgress(100);
        console.log(err)

      }
      console.log('Enter key pressed!');
    }
  };
  const submitPost = async (pass, username, ver, profPic) => {
  //const submitPost //= async (e) => {
    //e.preventDefault();
    
    //const email = document.getElementById('email').value;
    
    //const passwordAgain = document.getElementById('passwordAgain').value;

    //if (passwordAgain !== password) {
    //  setPasswordErr("Passwords don't match!");
//
    //  setTimeout(() => { setPasswordErr(''); }, 5000) 
    
    //} else {
      //const pass = //document.getElementById('password').value;
      setPassword(pass)
      const usr = {
        username: username,
        password: pass,
        profilePicture: profPic,
        "username_second":originalName,
        pool: ver
      };
      console.log(pass)
      console.log(usr)
      //const postText = document.getElementById('post').value;

      try {
        setProgress(30);
        const userRes = await axios.post(`/auth/register/${uniqId}`, usr)
        console.log(userRes.data.user);
        console.log(userRes.data.token);
        const user = userRes.data.user;
        console.log(user);
        console.log(user._id);
        //console.log(postText);
        if(user){
          localStorage.setItem('token', userRes.data.token);
          console.log("registered!!!");
          const token = localStorage.getItem('token');
          //try {
            //const res2 = await axios.post(`/posts/${uniqId}/create/`, { userId: user._id, desc: postText, headers: { 'auth-token': token }});
            //console.log(res2);
            
            try {
              setProgress(30);
               await axios.post(`/posts/${uniqId}/createInitialData/`, { version: user.pool, userId: user._id, headers: { 'auth-token': token }});
                //await axios.post("/posts/create", newPost);
                // refresh the page after posting something
                //window.location.reload();
                
                dispatch({ type: "LOGIN_SUCCESS", payload: user });
                history.push("/");
      
              } catch (err) {
                setProgress(100);
                console.log(err);}
            
            
          //} catch (err) {
          //  console.log(err)
          //}
        }
      } catch (err) {
        setProgress(100);
        setPasswordErr("Error");
        console.log(err)

      }
    //}
  };


  const MemoizedSlideDiv = React.memo(({ children }) => <SlideDiv>{children}</SlideDiv>);

    return (
      <>
      <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)}/>
      <ToastContainer></ToastContainer>
      <div className={classes.register}>

      <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleNoClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to select "{selectedUserName}" as your username?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleYesClose}>
            Yes
          </Button>
          <Button onClick={handleNoClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

    
        <form className={classes.form} noValidate autoComplete="off">
				<h1 style={{marginBottom: '2vh'}}>Sign Up</h1>

        <CSSTransition in={isVisibleBasicInfo} timeout={1000} classNames="slide" unmountOnExit >
        <SlideDiv>
        <div id='sixBlock'>
        <p className={classes.secon_disclaimor}>{disclaimor_1}</p>
        <p className={classes.secon_disclaimor}>{dear_part_2}</p>
        <p className={classes.secon_disclaimor}>{bitte_4}</p>

        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{aimHEADING_5}</h1>
        <p className={classes.secon_disclaimor}>{aim_6}</p>

        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{procedureHEADING_7}</h1>
        <p className={classes.secon_disclaimor}>{procedure_8}</p>

        {/*<p className={classes.secon_disclaimor}>{voluntaryHEADING_9}</p>
        <p className={classes.secon_disclaimor}>{voluntary_10}</p>
        <p className={classes.secon_disclaimor}>{other_11}</p>
        <p className={classes.secon_disclaimor}>{dataprotHEADING_12}</p>*/}
 
        <p className={classes.secon_disclaimor}>{procedure_8_1}</p>
        <ul>
        {labels2.map((label, index) => (
          <li className={classes.secon_disclaimor} key={index}>{label}</li>
        ))}
      </ul>
 
        <p className={classes.secon_disclaimor}>{dataprot_13}</p>

        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{datasharingHEADING_14}</h1>
        <p className={classes.secon_disclaimor}>{datasharing_15}</p>
        

        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{retentionHEADING_16}</h1>
        <p className={classes.secon_disclaimor}>{retention_17}</p>

        {<p className={classes.secon_disclaimor}>{furtherHEADING_18}</p>}
        {/*<p className={classes.secon_disclaimor}>{}</p>*/}
        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{further_19}</h1>
        <p className={classes.secon_disclaimor}>{complaints_20}</p> 
        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{best_21}</h1>
        
        
        <p className={classes.disclaimor2}>{nme_22}</p>
        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{consentHEADING_23}</h1>
        
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={isVisibleBasicInfo} timeout={1000} classNames="slide" unmountOnExit >
        <SlideDiv>
        <div id='sixBlock'>
        
        <p className={classes.disclaimor2}>{weitere}</p>
        <p className={classes.disclaimor2}>{consent_24}</p>
        
        {/*<p className={classes.disclaimor2}>{jaa}</p>*/}
        <p className={classes.disclaimor2}>{neinn}</p>
        <p className={classes.disclaimor2}>{name}</p>
        
        <h1 style={{marginBottom: '1vh', textAlign: 'Left'}}>{heading_one}</h1>
        <p className={classes.secon_disclaimor}>{q1}</p>
        <ul>
        {labels.map((label, index) => (
          <li className={classes.secon_disclaimor} key={index}>{label}</li>
        ))}
      </ul>
        </div></SlideDiv>
        </CSSTransition>

        
        
        <CSSTransition in={is_TestingFeedBack_visible} timeout={1000} classNames="slide" unmountOnExit>
        
        <div id='feeback2'>
        
        <p className={classes.secon_disclaimor}>{"Please report any issues that you found"}</p>
        <textarea  className={classes.label2} id="feedback" onChange={handle_feedback_Changed} ref={textareaRef} value={feedback} rows={4} placeholder={"Provide your feedback about the pre-survey here. A text area for feedback will also be available in the post-survey. Additionally, feel free to use these text fields to mention any other concerns or issues. You can also leave comments to highlight any problems encountered on the platform."}/>
        
        </div>
         
        </CSSTransition>
        
        <CSSTransition in={isVisibleBasic} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
         <div id='thirdBlock'>

        <form className={classes.question} style={{textAlign: 'Left'}}>
        <div className={classes.label}><label><input type="radio" value="option1" checked={value_q0 === 'option1'} onChange={handle_Q0_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{ja2}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option2" checked={value_q0 === 'option2'} onChange={handle_Q0_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{nein2}</span></label></div>
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>


        <CSSTransition in={false} timeout={1000} classNames="slide" unmountOnExit>
        <div id='Qrolific'>
        <p className={classes.secon_disclaimor}>{review_is_onward}</p>
        <p className={classes.label}> <input type="text" className="age-input" id="prolificcode" maxLength="7" onChange={handle_prolific_code} value={prolific_Code} placeholder="Upišite prolific code"/> </p>
        </div></CSSTransition>


        <CSSTransition in={is_Q1_visible} timeout={1000} classNames="slide" unmountOnExit >
         
        <div id='Q1'>
        <p className={classes.secon_disclaimor}>{q0_info}</p>
        <p className={classes.secon_disclaimor}>{q0}</p> 
        
        <p className={classes.label}> Imam <input type="text" className="age-input" id="age" maxLength="2" onChange={handle_age_Changed} value={age} placeholder="upišite broj"/> godina. Ukoliko ste mlađi od 18 godina ne možete da učestvujete u studiji.</p>
        
        </div>
         
        </CSSTransition>

        <CSSTransition in={is_Q2_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q2'>
        <p className={classes.secon_disclaimor}>{q2}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label ><input type="radio" value="option1"  checked={value_q2 === 'option1'} onChange={handle_Q2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q2_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q2 === 'option2'} onChange={handle_Q2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q2_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q2 === 'option3'} onChange={handle_Q2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q2_op3}</span></label></div>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q3_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q3'>
        <p className={classes.secon_disclaimor}>{q3}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q3 === 'option1'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q3 === 'option2'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q3 === 'option3'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q3 === 'option4'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q3 === 'option5'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op5}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option6"  checked={value_q3 === 'option6'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op6}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option7"  checked={value_q3 === 'option7'} onChange={handle_Q3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q3_op7}</span></label></div>
        </form>
        </div></SlideDiv>
        </CSSTransition>
          
        <CSSTransition in={is_Q4_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q4'>
        <p className={classes.secon_disclaimor}>{q4}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q4 === 'option1'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q4 === 'option2'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q4 === 'option3'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q4 === 'option4'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op4}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option5"  checked={value_q4 === 'option5'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op5}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option6"  checked={value_q4 === 'option6'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op6}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option7"  checked={value_q4 === 'option7'} onChange={handle_Q4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q4_op7}</span></label></div>
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        {/*
        <CSSTransition in={is_Q5_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q5'>
        <p className={classes.secon_disclaimor}>{q5}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q5 === 'option1'} onChange={handle_Q5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q5_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q5 === 'option2'} onChange={handle_Q5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q5_op2}</span></label></div>
        </form>
        </div></SlideDiv>
        </CSSTransition>
        */}

        <CSSTransition in={is_Q6_visible} timeout={1000} classNames="slide" unmountOnExit > 
        <div id='Q6'>
        <p className={classes.secon_disclaimor}>{q6}</p>
        <p className={classes.secon_disclaimor} style={{ fontStyle: 'italic' }}>{q6_info}</p>
        <form  className={classes.question}> 
        <p className={classes.label}> Moj poštanski kod počinje sa ova dva broja:  <input type="text" className="age-input" id="age2"  value={zipcode} maxLength="2" onChange={handle_age_Changed2} placeholder="Poštanski broj"/> </p>
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div> 
        </CSSTransition>

        <CSSTransition in={is_Q7_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q7'>
        <p className={classes.secon_disclaimor}>{q7}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q7 === 'option1'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q7 === 'option2'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3" checked={value_q7 === 'option3'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q7 === 'option4'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op4}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option5"  checked={value_q7 === 'option5'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op5}</span></label></div>
        {/*<div className={classes.label}><label><input type="radio" value="option6"  checked={value_q7 === 'option6'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op6}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option7"  checked={value_q7 === 'option7'}  onChange={handle_Q7_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q7_op7}</span></label></div>*/}
        </form>
        </div>
        </SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q8_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q8'>
        <p className={classes.secon_disclaimor}>{q8}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q8 === 'option1'}  onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q8 === 'option2'}  onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q8 === 'option3'}  onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q8 === 'option4'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op4}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option5"  checked={value_q8 === 'option5'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op5}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option6"  checked={value_q8 === 'option6'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op6}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option7"  checked={value_q8 === 'option7'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{q8_op7}</span></label></div>
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q9_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q9'>
        <p className={classes.secon_disclaimor}>{"test"}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q9 === 'option1'} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q9 === 'option2'} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q9 === 'option3'} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q9 === 'option4'} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option5"  checked={value_q9 === 'option5'} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q10_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q10'>
        <p className={classes.secon_disclaimor}>{"test"}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q10 === 'option1'} onChange={handle_Q10_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q10 === 'option2'} onChange={handle_Q10_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q10 === 'option3'} onChange={handle_Q10_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q10 === 'option4'} onChange={handle_Q10_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option5"  checked={value_q10 === 'option5'} onChange={handle_Q10_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"test"}</span></label></div>
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        

        <CSSTransition in={is_dank_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
          <div id='dank'>
            <p className={classes.secon_disclaimor}>{dank}</p>
            <p className={classes.secon_disclaimor}>{login1}</p>
            <p className={classes.secon_disclaimor}>{login2}</p>
        
				    {/*<p className={classes.text}>already have an account? <Link  style={{textDecoration: 'none'}} to={"/login/" + userId}>log in now</Link></p><p className={classes.disclaimor}>{disclaimor_1}</p>*/}
				    {/*<Avatar alt='choose avatar' src="" className={classes.avatar}/>
            	<TextField className={classes.textField} id='username' name='username' label="Username" required/>
				      <TextField className={classes.textField} id='email' name='email' label="Email" type="email" required />
				      <TextField className={classes.textField} id="password" label="Password" type="password" minLength="6" autoComplete="current-password"/>
				      <TextField className={classes.textField} id='passwordAgain' name='passwordAgain' label="Password Again" type="password" required/>
              <p className={classes.errorMessage}>{passwordErr}</p>*/}
            <button onClick={reviewButtonChanged} disabled={isButtonDisabled} className={classes.button}>Izmeni odgovore</button>.
            <button onClick={companyButtonChanged} disabled={isButtonDisabled} className={classes.button}>Nastavi</button>.
          </div></SlideDiv>
        </CSSTransition>

      <CSSTransition in={isVisibleSignUp} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
      <div id='secondBlock'>
      {/*<p className={classes.secon_disclaimor4}>{welcome}</p>*/}
      <p className={classes.secon_disclaimor}>{login1}</p>
      <p className={classes.secon_disclaimor}>{login2}</p>
        <form  className={classes.question}>
        <div className={classes.label}>
          <label>
          <input type="radio" value="option1"  checked={value_q11 === 'option1'} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/>
          <span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}>
            <img width="50" height="50"className={classes.profileCoverImg}  src={profPic1 != "" ? PF+profPic1 : PF+"person/noCover.png"} alt="" />{usrName1}
            </span>
            </label>
            </div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q11 === 'option2'} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}><img width="50" height="50" className={classes.profileCoverImg}  src={profPic2 != "" ? PF+profPic2 : PF+"person/noCover.png"} alt="" />{usrName2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q11 === 'option3'} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}><img width="50" height="50" className={classes.profileCoverImg}  src={profPic3 != "" ? PF+profPic3 : PF+"person/noCover.png"} alt="" />{usrName3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q11 === 'option4'} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}><img width="50" height="50" className={classes.profileCoverImg}  src={profPic3 != "" ? PF+profPic4 : PF+"person/noCover.png"} alt="" />{usrName4}</span></label></div>
        
        <button hidden={isNextDisplays} className={classes.button} onClick={submitNext}> nastavi  </button>
        </form>
        
        </div></SlideDiv>
        </CSSTransition>

        {/*<CSSTransition in={is_password_visible} timeout={1000} classNames="fade" unmountOnExit >
        <div id='Q5'>
        <p className={classes.secon_disclaimor4}>{welcome2}</p>
        <p className={classes.secon_disclaimor4}>{infoPass}</p>
        <span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}>
            <img width="50" height="50"className={classes.profileCoverImg}  src={proPic != "" ? PF+proPic : PF+"person/noCover.png"} alt="" /> {" "+username}
            </span>
        <TextField className={classes.textField3} id="password" label="Password" value={password4}/>
				
        <p className={classes.secon_disclaimor5}>{note}</p>
        <p className={classes.secon_disclaimor4}>{[...enony, "https://socialapp.ijs.si/register/" +uniqId]}</p>
        <p className={classes.secon_disclaimor4}>{screen}</p>
        <p className={classes.secon_disclaimor4}>{plzCon}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1" checked={value_confirmation === 'option1'}  onChange={submitPost} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{"Bestätigen"}</span></label></div>
        
        </form>
        </div>
        </CSSTransition>*/}

        <CSSTransition in={isWelcomeVisible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='posts'>
        <form  className={classes.question}>
        <p className={classes.secon_disclaimor4}>{""}</p>
        <p className={classes.secon_disclaimor4}>{"test"}</p>
        <p className={classes.secon_disclaimor4}>{"test"}</p>
        <p className={classes.secon_disclaimor4}>{"test"}</p>
        <input className={classes.label2} id='post' onChange={handPostTextChange} placeholder={""} onKeyPress={handleKeyPress}/>
        <button type="submit" hidden={isPostButtonDisplays} className={classes.button} onClick={submitPost}> Post </button>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        {
        //handle_Confirm_Changed
        /*<CSSTransition in={is_Post_visible} timeout={300} classNames="fade" unmountOnExit >
        <div id='Q5'>
        <form  className={classes.question}>
        <button type="submit" className={classes.button} onClick={handleClick}> Post </button>
        </form>
        </div>
            </CSSTransition>*/}
        </form>
        </div>
        </>
    );
}

export default withStyles(styles)(Register);


