import React from 'react';
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import Topbar from "../../components/topbar/Topbar.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import Feed from "../../components/feed/Feed.js";
import Rightbar from "../../components/rightbar/Rightbar.js";
import axios from "axios";
import { useParams } from 'react-router';
import { Add, Remove } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './postsurveyStyle.js';
import styled, { keyframes } from 'styled-components';
import LoadingBar from "react-top-loading-bar";

import { useMediaQuery } from 'react-responsive';
import TextField from '@material-ui/core/TextField'
import { colors } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useHistory } from "react-router";
import { ToastContainer } from 'react-toastify';
import {regSw, subscribe} from '../../helper.js';
import { Line, Circle } from 'rc-progress';
import { CSSTransition } from 'react-transition-group';
import { useScrollBy } from "react-use-window-scroll";
import { 
  Submit_Post_Survey, A_user_with, 
  last_info1, last_info2, last_info3, last_info4, last_info5, 
  review_is_onward, post_q8_info,
  
  
  // Import the new question text and options
  post_q1_0, post_q1, post_q1_op1, post_q1_op2, post_q1_op3, post_q1_op4, post_q1_op5,
  post_q2, post_q2_op1, post_q2_op2, post_q2_op3, post_q2_op4, post_q2_op5,
  post_q3, post_q3_op1, post_q3_op2, post_q3_op3, post_q3_op4, post_q3_op5,
  post_q4, post_q4_op1, post_q4_op2, post_q4_op3, post_q4_op4, post_q4_op5,
  post_q5, post_q5_op1, post_q5_op2, post_q5_op3, post_q5_op4, post_q5_op5,
  post_q6, post_q6_op1, post_q6_op2, post_q6_op3, post_q6_op4, post_q6_op5,
  post_q7, post_q7_op1, post_q7_op2, post_q7_op3, post_q7_op4, post_q7_op5,
  post_q8_0,
  post_q8, post_q8_op1, post_q8_op2, post_q8_op3, post_q8_op4, post_q8_op5, 
  post_q8_op6, post_q8_op7, post_q8_op8, post_q8_op9, post_q8_op10,
  post_q9, post_q9_op1, post_q9_op2, post_q9_op3, post_q9_op4, post_q9_op5, 
  post_q9_op6, post_q9_op7, post_q9_op8, post_q9_op9,
  post_q10, post_q10_op1, post_q10_op2, post_q10_op3, post_q10_op4, post_q10_op5,
  post_q11, post_q11_op1, post_q11_op2, post_q11_op3, post_q11_op4, post_q11_op5, 
  post_q11_op6, post_q11_op7, post_q11_op8, post_q11_op9, post_q11_op10,
  post_q11_op11, post_q11_op12, post_q11_op13, post_q11_op14, post_q11_op15, 
  post_q11_op16, post_q11_op17, post_q11_op18, post_q11_op19, post_q11_op20, post_q11_op21,
  post_q12, post_q12_op1, post_q12_op2, post_q12_op3, post_q12_op4, post_q12_op5,
  post_q13, post_q13_op1, post_q13_op2, post_q13_op3, post_q13_op4, post_q13_op5, 
  post_q13_op6, post_q13_op7, post_q13_op8, post_q13_op9, post_q13_op10, post_q13_op11,
  post_q14, post_q14_op1, post_q14_op2, post_q14_op3, post_q14_op4, post_q14_op5,
  post_q15, post_q15_op1, post_q15_op2, post_q15_op3, post_q15_op4, post_q15_op5, 
  post_q15_op6, post_q15_op7, post_q15_op8,
  post_q16, post_q16_op1, post_q16_op2, post_q16_op3, post_q16_op4, post_q16_op5,
  post_q17, post_q17_op1, post_q17_op2, post_q17_op3, post_q17_op4, post_q17_op5,
  post_q18, post_q18_op1, post_q18_op2, post_q18_op3, post_q18_op4, post_q18_op5,
  post_q19, post_q19_op1, post_q19_op2, post_q19_op3, post_q19_op4, post_q19_op5, post_q19_op6,
  post_q20, post_q20_op1, post_q20_op2, post_q20_op3, post_q20_op4, post_q20_op5,
  post_info_2, post_info_3,
  post_q21, post_q21_op1, post_q21_op2, post_q21_op3, post_q21_op4, post_q21_op5, post_q21_op6, post_q21_op7,
  post_q22, post_q22_op1, post_q22_op2, post_q22_op3, post_q22_op4, post_q22_op5, post_q22_op6, post_q22_op7,
  post_q23, post_q23_op1, post_q23_op2, post_q23_op3, post_q23_op4, post_q23_op5, post_q23_op6, post_q23_op7,
  post_q24, post_q24_op1, post_q24_op2, post_q24_op3, post_q24_op4, post_q24_op5, post_q24_op6, post_q24_op7,
  post_q24_0, post_q24_1, post_q24_1_op1, post_q24_1_op2, post_q24_1_op3, post_q24_1_op4, post_q24_1_op5, post_q24_1_op6, post_q24_1_op7,
  post_q24_2, post_q24_2_op1, post_q24_2_op2, post_q24_2_op3, post_q24_2_op4, post_q24_2_op5,
  post_q24_3_0, post_q24_3, post_q24_3_op1, post_q24_3_op2, post_q24_3_op3, post_q24_3_op4, post_q24_3_op5,
  post_q24_4, post_q24_4_op1, post_q24_4_op2, post_q24_4_op3, post_q24_4_op4, post_q24_4_op5,
  post_q24_5, post_q24_5_op1, post_q24_5_op2, post_q24_5_op3, post_q24_5_op4, post_q24_5_op5,
  post_q25_0, post_q25, post_q25_op1, post_q25_op2, post_q25_op3, post_q25_op4, post_q25_op5,
  post_q25_1, post_q25_1_op1, post_q25_1_op2, post_q25_1_op3, post_q25_1_op4, post_q25_1_op5,
  post_q25_2, post_q25_2_op1, post_q25_2_op2, post_q25_2_op3, post_q25_2_op4, post_q25_2_op5,
  post_q26_0, post_q26, post_q26_op1, post_q26_op2, post_q26_op3, post_q26_op4, post_q26_op5,
  post_q27, post_q27_op1, post_q27_op2, post_q27_op3, post_q27_op4, post_q27_op5,
  post_q28, post_q29_0, post_q29,
  post_q29_1_op1, post_q29_1_op2, post_q29_1_op3, post_q29_1_op4, post_q29_1_op5, post_q29_1_op6, post_q29_1_op7,
  post_q29_2_op1, post_q29_2_op2, post_q29_2_op3, post_q29_2_op4, post_q29_2_op5, post_q29_2_op6, post_q29_2_op7,
  post_q29_3_op1, post_q29_3_op2, post_q29_3_op3, post_q29_3_op4, post_q29_3_op5, post_q29_3_op6, post_q29_3_op7,
  post_q29_4_op1, post_q29_4_op2, post_q29_4_op3, post_q29_4_op4, post_q29_4_op5, post_q29_4_op6, post_q29_4_op7,
  post_q29_5_op1, post_q29_5_op2, post_q29_5_op3, post_q29_5_op4, post_q29_5_op5, post_q29_5_op6, post_q29_5_op7,
  post_q29_6_op1, post_q29_6_op2, post_q29_6_op3, post_q29_6_op4, post_q29_6_op5, post_q29_6_op6, post_q29_6_op7,
  post_q29_7_op1, post_q29_7_op2, post_q29_7_op3, post_q29_7_op4, post_q29_7_op5, post_q29_7_op6, post_q29_7_op7,
  post_q42

} from '../../constants_STA';
import { set } from 'mongoose';


function Postsurvey({ classes }) {
    
  const scrollBy = useScrollBy();
  
  
  const feedbackRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preImage, setPreImage] = useState(null);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [bio, setBio] = useState("");
    const [progress, setProgress] = useState(0);
    const [userId, setUserId] = useState("");
    const history = useHistory();
    const [usr, setUsr] = useState({});
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [relationship, setRelationship] = useState("");
    const username = useParams().username;
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
    const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
    const [followed, setFollowed] = useState([]);
    const [isProfileFetched, setIsProfileFetched] = useState(true);
    const [prevUN, setPrevUN] = useState("");
    const [percent, setPercent] = useState(0);
    const [is_TestingFeedBack_visible, setIs_TestingFeedBack_visible] = useState(false);
    const [isUserReviewing, setIsUserReviewing] = useState(false);
    
    const [day_One_Percent, setDay_One_Percent] = useState(0);
    const [thumbnail, setThumbnail] = useState('');
    const [desc, setDesc] = useState('');
    const [postSpecificText, setPostSpecificText] = useState('');
    
    
    
    const [day_Two_Percent, setDay_Two_Percent] = useState(0);
    const [day_Three_Percent, setDay_Three_Percent] = useState(0);
    const [day_Four_Percent, setDay_Four_Percent] = useState(0);
    const [day_Five_Percent, setDay_Five_Percent] = useState(0);
    const [isWideScreen, setIsWideScreen] = useState(false);

    const [passwordErr, setPasswordErr] = useState('');

    const [isVisible, setIsVisible] = useState(true);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    
    const [is_code_visible, set_Is_code_visible] = useState(false);
    const [isSurveySubmitted, setIsSurveySubmitted] = useState(false);
    
    

    const [status_msg, stStatus_msg] = useState("Sie sind nicht berechtigt, an der Nachbefragung teilzunehmen");
    const [status_msg2, stStatus_msg2] = useState("");
    
    const [One_Post, Set_One_Post] = useState("");
    
    const [value_q1, stValue_q1] = useState('');
    const [value_q2, stValue_q2] = useState('');
    const [value_q3, stValue_q3] = useState('');
    const [value_q4, stValue_q4] = useState('');
    const [value_q5, stValue_q5] = useState('');
    
    const [value_q6, stValue_q6] = useState('');

    const [value_q7, stValue_q7] = useState('');
    const [someelseValue, setSomeelseValue] = useState('');
    
    const [value_q8, stValue_q8] = useState('');
    const [value_q9, stValue_q9] = useState([]);
    const [value_q10, stValue_q10] = useState('');
    const [value_q11, stValue_q11] = useState([]);
    const [value_q12, stValue_q12] = useState('');
    
    const [value_q13, stValue_q13] = useState([]);
    const [value_q14, stValue_q14] = useState('');
    const [value_q15, stValue_q15] = useState([]);
    
    const [value_q16, stValue_q16] = useState('');
    const [value_q17, stValue_q17] = useState('');
    const [value_q18, stValue_q18] = useState('');
    
    const [value_q19, stValue_q19] = useState([]);
    const [value_q20, stValue_q20] = useState('');
    
    const [value_q23, stValue_q23] = useState('');

    const [value_q24, stValue_q24] = useState('');
    const [value_q24_1, stValue_q24_1] = useState('');
    const [value_q24_2, stValue_q24_2] = useState('');
    const [value_q24_3, stValue_q24_3] = useState('');
    const [value_q24_4, stValue_q24_4] = useState('');
    const [value_q24_5, stValue_q24_5] = useState('');
    const [value_q25, stValue_q25] = useState('');
    const [value_q26, stValue_q26] = useState('');
    const [value_q22, stValue_q22] = useState('');
    const [value_q21, stValue_q21] = useState('');
    const [value_q25_1, stValue_q25_1] = useState('');
    const [value_q25_2, stValue_q25_2] = useState('');
    const [value_q27, stValue_q27] = useState('');

    const [value_q28, stValue_q28] = useState('');
    const [value_q29, stValue_q29] = useState('');
    const [value_q29_1, stValue_q29_1] = useState('');
    const [value_q29_2, stValue_q29_2] = useState('');
    const [value_q29_3, stValue_q29_3] = useState('');
    const [value_q29_4, stValue_q29_4] = useState('');
    const [value_q29_5, stValue_q29_5] = useState('');
    const [value_q29_6, stValue_q29_6] = useState('');
    const [value_q29_7, stValue_q29_7] = useState('');
    const [value_q30, stValue_q30] = useState('');
    const [value_q31, stValue_q31] = useState('');
    const [value_q32, stValue_q32] = useState('');
    const [value_q33, stValue_q33] = useState('');
    const [value_q34, stValue_q34] = useState('');
    const [value_q34_1, stValue_q34_1] = useState('');
    const [value_q34_2, stValue_q34_2] = useState('');
    const [value_q34_3, stValue_q34_3] = useState('');
    const [value_q34_4, stValue_q34_4] = useState('');
    const [value_q35, stValue_q35] = useState([]);
    const [value_q36, stValue_q36] = useState('');
    const [value_q37, stValue_q37] = useState('');
    const [value_q38, stValue_q38] = useState('');
    const [value_q39, stValue_q39] = useState('');
    const [value_q40, stValue_q40] = useState('');
    const [value_q41, stValue_q41] = useState('');
    const [value_q42, stValue_q42] = useState('');

    


  const [is_Q1_visible, setIs_Q1_visible] = useState(false);
  const [is_Q2_visible, setIs_Q2_visible] = useState(false);
  const [is_NoSurvey_visible, setIs_NoSurvey_visible] = useState(false);
  const [is_review_is_onward, setIs_review_is_onward]     = useState(true);
  
  const [is_Q3_visible, setIs_Q3_visible] = useState(false);
  const [is_Q4_visible, setIs_Q4_visible] = useState(false);
  
  const [is_Q5_visible, setIs_Q5_visible] = useState(false);
  const [is_Q6_visible, setIs_Q6_visible] = useState(false);
  
  const [is_Q7_visible, setIs_Q7_visible] = useState(false);
  const [is_Q8_visible, setIs_Q8_visible] = useState(false);
  const [is_Q9_visible, setIs_Q9_visible] = useState(false);
  
  const [is_Q10_visible, setIs_Q10_visible] = useState(false);
  
  const [feedback, setFeedback] = useState("");
  const [feedback2, setFeedback2] = useState("");
  const [feedback3, setFeedback3] = useState("");
  
  
  const [is_Q11_visible, setIs_Q11_visible] = useState(false);
  const [is_Q12_visible, setIs_Q12_visible] = useState(false);
  
  const [is_Q13_visible, setIs_Q13_visible] = useState(false);
  
  
  
  const [is_Q14_visible, setIs_Q14_visible] = useState(false);
  const [is_Q15_visible, setIs_Q15_visible] = useState(false);
  
  const [is_Q16_visible, setIs_Q16_visible] = useState(false);
  const [is_Q17_visible, setIs_Q17_visible] = useState(false);
  const [is_Q18_visible, setIs_Q18_visible] = useState(false);
  const [is_Q19_visible, setIs_Q19_visible] = useState(false);
  const [is_Q20_visible, setIs_Q20_visible] = useState(false);
  const [is_Q24_1_visible, setIs_Q24_1_visible] = useState(true);
  const [is_Q24_2_visible, setIs_Q24_2_visible] = useState(true);
  const [is_Q24_3_visible, setIs_Q24_3_visible] = useState(true);
  const [is_Q24_4_visible, setIs_Q24_4_visible] = useState(true);
  const [is_Q24_5_visible, setIs_Q24_5_visible] = useState(true);
  const [is_Q25_visible, setIs_Q25_visible] = useState(false);
  const [is_Q25_1_visible, setIs_Q25_1_visible] = useState(false);
  const [is_Q25_2_visible, setIs_Q25_2_visible] = useState(false);
  const [is_Q26_visible, setIs_Q26_visible] = useState(false);
  const [is_Q27_visible, setIs_Q27_visible] = useState(false);
  const [is_Q28_visible, setIs_Q28_visible] = useState(false);
  const [is_Q29_visible, setIs_Q29_visible] = useState(false);
  const [is_Q42_visible, setIs_Q42_visible] = useState(false);


  const [textInputQ9, setTextInputQ9] = useState('');
  const [textInputQ11, setTextInputQ11] = useState('');
  const [textInputQ13, setTextInputQ13] = useState('');
    
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

const SlideDiv = styled.div`
&.slide-enter {
animation: ${slideIn} 1s forwards;
}
&.slide-exit {
animation: ${slideOut} 1s forwards;
}
`;





useEffect(() => {
  const token = localStorage.getItem('token');
  
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 400); // Adjust threshold as needed
  };

  // Check initial screen width
  handleResize();
  
  const fetchUser = async () => {
    const res = await axios.get(`/users?username=${username}`, {headers: { 'auth-token': token }})
    console.log("fetch user");
    console.log(res.data)
    setUsr(res.data);
    console.log(usr);
    setPrevUN(username);
};
  fetchUser();
  fetchTimeSpent2();
  setIsProfileFetched(true);

  if(day_One_Percent > 0){
    console.log("day_One_Percent");
    setIsVisible(true);
  }

}, []);

const fetchTimeSpent = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get("/users/" + currentUser._id + "/getTimeSpent", {headers: { 'auth-token': token }})
  console.log(res.data);
  setDay_One_Percent(calculatePercentage(res.data["today"], 0));
  setDay_Two_Percent(calculatePercentage(res.data["oneDayBefore"], 0));
  setDay_Three_Percent(calculatePercentage(res.data["twoDayBefore"], 0));
  setDay_Four_Percent(calculatePercentage(res.data["threeDayBefore"], 0));
  setDay_Five_Percent(calculatePercentage(res.data["fourDayBefore"], 0));
  
};

const fetchTimeSpent2 = async () => {
  const token = localStorage.getItem('token');
    //const res = await axios.get("/users/" + currentUser._id + "/getUserActions", {headers: { 'auth-token': token }})
    //console.log(res.data);
     //  if(res.data["showAlert"] == "yes"){
      
    //    setDay_One_Percent(100);
    //    setDay_Two_Percent(100);
    //    setDay_Three_Percent(100);
    //    setDay_Four_Percent(100);
    //    setDay_Five_Percent(100);
    //    setIs_Q1_visible(true);
     //   setIs_review_is_onward(true);
        
     //   }
  
     //   if(res.data["showAlert"] == "no"){
    //      setDay_One_Percent(0);
    //      setDay_Two_Percent(0);
    //      setDay_Three_Percent(0);
     //     setDay_Four_Percent(0);
     //     setDay_Five_Percent(0);
     //     setIs_Q1_visible(true);
     //     setIs_review_is_onward(true);
     // }
      
    const post_different_version = await axios.get("/posts/" + currentUser._id + "/getUserPost", {headers: { 'auth-token': token }})
    
    if(post_different_version.data.message2){
    set_Is_code_visible(true) 
        setIsSurveySubmitted(true)
        stStatus_msg2(post_different_version.data.message);
              
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
        setIs_Q11_visible(false);
        setIs_Q12_visible(false); 
        setIs_Q13_visible(false);
	      setIs_Q14_visible(false);
        setIs_Q15_visible(false); 
        setIs_Q16_visible(false); 
        setIs_Q17_visible(false);
        setIs_Q18_visible(false);
        setIs_Q19_visible(false);
        setIs_Q20_visible(false);
        setIs_Q24_1_visible(false);
        setIs_Q24_2_visible(false);
        setIs_Q24_3_visible(false);
        setIs_Q24_4_visible(false);
        setIs_Q24_5_visible(false);
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
        setIs_Q26_visible(false);
        setIs_Q27_visible(false);
        setIs_Q28_visible(false);
        setIs_Q29_visible(false);
        setIs_Q42_visible(false);
        setIs_TestingFeedBack_visible(false);
    }else{
    const post = post_different_version.data[post_different_version.data.length - 1];
    console.log("Post Survey");
    console.log(currentUser.pool);
    console.log(post);
    if(currentUser.pool === "1" || currentUser.pool ==="2"){
      setPostSpecificText("6. Wie wahrscheinlich wäre es, dass Sie sich mit einem mRNA Impfstoff impfen lassen würden?");
      
    }else if(currentUser.pool == "3" || currentUser.pool ==="4" || currentUser.pool ==="5"){
      setPostSpecificText("6. Wie wahrscheinlich wäre es, dass Sie sich gegen Mpox (Affenpocken) impfen lassen würden?");
      
    }
    
    
    const handleFetchThumbnail = async () => {
      try {
        if (post && post.thumb) {
          console.log(post.thumb);
          const token = localStorage.getItem('token');
          const response = await axios.post('/posts/fetch-thumbnail', { urls : post.thumb, headers: { 'auth-token': token } }); 
          setThumbnail(response.data.thumbnail);
        } else {
          console.error('Post or post.thumb is undefined');
          setThumbnail(''); // Set a default empty thumbnail
        }
      } catch (error) {
        console.error('Error fetching thumbnail:', error);
      }
    };
      handleFetchThumbnail();
    
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


const calculatePercentage = (numerator, denominator) => {
  // Ensure denominator is not 0 to avoid division by zero error
  if (denominator !== 0) {
    const perct = (numerator/denominator) * 100
    console.log(numerator)
    console.log(denominator)
    console.log(perct)
    if(perct > -10){
      return (100);
    }
    return (perct).toFixed(0);
  } else {
    return 'N/A';
  }
};

const handleUserNameChange = async (e) => {
    if(e.target.value != ""){
      if(e.target.value.length == 1){
        //scrollBy({ top: 700, left: 0, behavior: "smooth" })
      }
      //setIs_Q2_visible(true);
      setIs_Q3_visible(true);
      setIs_Q4_visible(true);
      setIs_Q4_visible(true);
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      setIs_Q7_visible(true);
      setIs_Q8_visible(true);
      setIs_Q9_visible(true);
      setIs_Q10_visible(true);
      setIs_Q11_visible(true);
      setIs_Q12_visible(true);
      setIs_Q13_visible(true);
      setIs_Q14_visible(true);
      setIs_Q15_visible(true);
      setIs_Q16_visible(true);
      setIs_Q17_visible(true);
      setIs_Q18_visible(true);

    }else{
      //setIs_Q2_visible(true);
      setIs_Q3_visible(true);
      setIs_Q4_visible(true);
      setIs_Q4_visible(true);
      setIs_Q5_visible(true);
      setIs_Q6_visible(true);
      setIs_Q7_visible(true);
      setIs_Q8_visible(true);
      setIs_Q9_visible(true);
      setIs_Q10_visible(true);
      setIs_Q11_visible(true);
      setIs_Q12_visible(true);
      setIs_Q13_visible(true);
      setIs_Q14_visible(true);
      setIs_Q15_visible(true);
      setIs_Q16_visible(true);
      setIs_Q17_visible(true);
      setIs_Q18_visible(true);

    }
}


  const handle_Q24_1_Changed = (e) => {
    stValue_q24_1(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q24_2 != "" && value_q24_3 != "" && value_q24_4 != "" && value_q24_5 != "" ){
          setIs_Q25_visible(true);
          setIs_Q25_1_visible(true);
          setIs_Q25_2_visible(true);
          setIs_Q24_1_visible(false);
          setIs_Q24_2_visible(false);
          setIs_Q24_3_visible(false);
          setIs_Q24_4_visible(false);
          setIs_Q24_5_visible(false);
      } else {
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
      }}};

  const handle_Q24_2_Changed =  (e) => {
    stValue_q24_2(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q24_1 != "" && value_q24_3 != "" && value_q24_4 != "" && value_q24_5 != "" ){
          setIs_Q25_visible(true);
          setIs_Q25_1_visible(true);
          setIs_Q25_2_visible(true);
          setIs_Q24_1_visible(false);
          setIs_Q24_2_visible(false);
          setIs_Q24_3_visible(false);
          setIs_Q24_4_visible(false);
          setIs_Q24_5_visible(false);
      } else {
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
      }}};

  const handle_Q24_3_Changed =  (e) => {
    stValue_q24_3(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q24_1 != "" && value_q24_2 != "" && value_q24_4 != "" && value_q24_5 != "" ){
          setIs_Q25_visible(true);
          setIs_Q25_1_visible(true);
          setIs_Q25_2_visible(true);
          setIs_Q24_1_visible(false);
          setIs_Q24_2_visible(false);
          setIs_Q24_3_visible(false);
          setIs_Q24_4_visible(false);
          setIs_Q24_5_visible(false);
      } else {
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
      }}};

  const handle_Q24_4_Changed =  (e) => {
    stValue_q24_4(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q24_1 != "" && value_q24_2 != "" && value_q24_3 != "" && value_q24_5 != "" ){
          setIs_Q25_visible(true);
          setIs_Q25_1_visible(true);
          setIs_Q25_2_visible(true);
          setIs_Q24_1_visible(false);
          setIs_Q24_2_visible(false);
          setIs_Q24_3_visible(false);
          setIs_Q24_4_visible(false);
          setIs_Q24_5_visible(false);
      } else {
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
      }}};

  const handle_Q24_5_Changed =  (e) => {
    stValue_q24_5(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q24_1 != "" && value_q24_2 != "" && value_q24_3 != "" && value_q24_4 != "" ){
          setIs_Q25_visible(true);
          setIs_Q25_1_visible(true);
          setIs_Q25_2_visible(true);
          setIs_Q24_1_visible(false);
          setIs_Q24_2_visible(false);
          setIs_Q24_3_visible(false);
          setIs_Q24_4_visible(false);
          setIs_Q24_5_visible(false);
      } else {
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
      }}};

  const handle_Q25_Changed =  (e) => {
    stValue_q25(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q25_1 != "" && value_q25_2 != "" ){
          setIs_Q29_visible(true);
          setIs_Q25_visible(false);
          setIs_Q25_1_visible(false);
          setIs_Q25_2_visible(false);
      } else {
        setIs_Q29_visible(false);
      }}};

  const handle_Q25_1_Changed =  (e) => {
    stValue_q25_1(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q25 != "" && value_q25_2 != "" ){
          setIs_Q29_visible(true);
          setIs_Q25_visible(false);
          setIs_Q25_1_visible(false);
          setIs_Q25_2_visible(false);
      } else {
        setIs_Q29_visible(false);
      }}};

  const handle_Q25_2_Changed =  (e) => {
    stValue_q25_2(e.target.value);
    console.log(e.target.value);
    if(isUserReviewing == false){
      if(e.target.value != "" && value_q25 != "" && value_q25_1 != "" ){
          setIs_Q29_visible(true);
          setIs_Q25_visible(false);
          setIs_Q25_1_visible(false);
          setIs_Q25_2_visible(false);
      } else {
        setIs_Q29_visible(false);
      }}};


    const handle_Q29_1_Changed =  (e) => { 
      stValue_q29_1(e.target.value);
      console.log(e.target.value);
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_3 != "" && value_q29_4 != "" && value_q29_5 != "" && value_q29_6 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};
    
    const handle_Q29_2_Changed =  (e) => {
      stValue_q29_2(e.target.value);
      console.log(e.target.value); 
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_1 != "" && value_q29_3 != "" && value_q29_4 != "" && value_q29_5 != "" && value_q29_6 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};
    
    
    const handle_Q29_3_Changed =  (e) => { 
      stValue_q29_3(e.target.value);
      console.log(e.target.value);
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_1 != "" && value_q29_4 != "" && value_q29_5 != "" && value_q29_6 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};
    
    const handle_Q29_4_Changed =  (e) => {
      stValue_q29_4(e.target.value);
      console.log(e.target.value);
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_3 != "" && value_q29_1 != "" && value_q29_5 != "" && value_q29_6 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};

    const handle_Q29_5_Changed =  (e) => {
      stValue_q29_5(e.target.value);
      console.log(e.target.value);
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_3 != "" && value_q29_4 != "" && value_q29_1 != "" && value_q29_6 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};

      const handle_Q29_6_Changed =  (e) => {
      stValue_q29_6(e.target.value);
      console.log(e.target.value);
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_3 != "" && value_q29_4 != "" && value_q29_5 != "" && value_q29_1 != "" && value_q29_7 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};

    const handle_Q29_7_Changed =  (e) => {
      stValue_q29_7(e.target.value);
      console.log(e.target.value); 
      if(isUserReviewing == false){
        if(e.target.value != "" && value_q29_2 != "" && value_q29_3 != "" && value_q29_4 != "" && value_q29_5 != "" && value_q29_6 != "" && value_q29_1 != "" ){
            setIs_Q1_visible(true);
            setIs_Q29_visible(false);
        } else {
          setIs_Q1_visible(false);
        }}};    

    const handle_Q1_Changed =  (e) => { 
      stValue_q1(e.target.value); 
      console.log(e.target.value);
      if(isUserReviewing == false){
      if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
        setIs_Q1_visible(false);
        setIs_Q8_visible(true);
        setIs_Q9_visible(true);
        setIs_Q11_visible(true);
        setIs_Q13_visible(true);
        setIs_Q15_visible(true);
        setIs_Q16_visible(true);
        } else {
          setIs_Q8_visible(false);
          setIs_Q9_visible(false);
          setIs_Q11_visible(false);
          setIs_Q13_visible(false);
          setIs_Q15_visible(false);
          setIs_Q16_visible(false);
        }  
      }};

      const handle_Q2_Changed =  (e) => { 
        stValue_q2(e.target.value); 
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q1 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }  
        }};

      const handle_Q3_Changed =  (e) => { 
        stValue_q3(e.target.value); 
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q2 != "" && value_q1 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }  
        }};

      const handle_Q4_Changed =  (e) => { 
        stValue_q4(e.target.value); 
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q1 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }  
        }};

      const handle_Q5_Changed =  (e) => { 
        stValue_q5(e.target.value); 
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q1 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }  
        }};

      const handle_Q6_Changed =  (e) => {
        stValue_q6(e.target.value);
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q1 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }
        }};
      
      const handle_Q7_Changed =  (e) => {
        stValue_q7(e.target.value);
        console.log(e.target.value);
        if(isUserReviewing == false){
        if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q1 != "" && value_q10 != "" && value_q12 != "" && value_q14 != "" ){
          setIs_Q1_visible(false);
          setIs_Q8_visible(true);
          setIs_Q9_visible(true);
          setIs_Q11_visible(true);
          setIs_Q13_visible(true);
          setIs_Q15_visible(true);
          setIs_Q16_visible(true);
          } else {
            setIs_Q8_visible(false);
            setIs_Q9_visible(false);
            setIs_Q11_visible(false);
            setIs_Q13_visible(false);
            setIs_Q15_visible(false);
            setIs_Q16_visible(false);
          }
        }};

      const handle_Q10_Changed =  (e) => {
        stValue_q10(e.target.value);
        console.log(e.target.value);
        if(isUserReviewing == false){
          if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q1 != "" && value_q12 != "" && value_q14 != "" ){
            setIs_Q1_visible(false);
            setIs_Q8_visible(true);
            setIs_Q9_visible(true);
            setIs_Q11_visible(true);
            setIs_Q13_visible(true);
            setIs_Q15_visible(true);
            setIs_Q16_visible(true);
            } else {
              setIs_Q8_visible(false);
              setIs_Q9_visible(false);
              setIs_Q11_visible(false);
              setIs_Q13_visible(false);
              setIs_Q15_visible(false);
              setIs_Q16_visible(false);
            }
          }};

      const handle_Q12_Changed =  (e) => {
        stValue_q12(e.target.value);
        console.log(e.target.value);
        if(isUserReviewing == false){
          if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q1 != "" && value_q14 != "" ){
            setIs_Q1_visible(false);
            setIs_Q8_visible(true);
            setIs_Q9_visible(true);
            setIs_Q11_visible(true);
            setIs_Q13_visible(true);
            setIs_Q15_visible(true);
            setIs_Q16_visible(true);
            } else {
              setIs_Q8_visible(false);
              setIs_Q9_visible(false);
              setIs_Q11_visible(false);
              setIs_Q13_visible(false);
              setIs_Q15_visible(false);
              setIs_Q16_visible(false);
            }
          }};

        const handle_Q14_Changed =  (e) => {
          stValue_q14(e.target.value);
          console.log(e.target.value);
          if(isUserReviewing == false){
            if(e.target.value != "" && value_q2 != "" && value_q3 != "" && value_q4 != "" && value_q5 != "" && value_q6 != "" && value_q7 != "" && value_q10 != "" && value_q12 != "" && value_q1 != "" ){
              setIs_Q1_visible(false);
              setIs_Q8_visible(true);
              setIs_Q9_visible(true);
              setIs_Q11_visible(true);
              setIs_Q13_visible(true);
              setIs_Q15_visible(true);
              setIs_Q16_visible(true);
              } else {
                setIs_Q8_visible(false);
                setIs_Q9_visible(false);
                setIs_Q11_visible(false);
                setIs_Q13_visible(false);
                setIs_Q15_visible(false);
                setIs_Q16_visible(false);
              }
            }};

        const handle_Q8_Changed =  (e) => { 
          console.log(e.target.value);
          stValue_q8(e.target.value); 
          if(isUserReviewing == false){
            if(e.target.value != "" && value_q16 != ""){
              setIs_Q17_visible(true);
              setIs_Q18_visible(true);
              setIs_Q19_visible(true);
              setIs_Q20_visible(true);

              setIs_Q8_visible(false);
              setIs_Q9_visible(false);
              setIs_Q11_visible(false);
              setIs_Q13_visible(false);
              setIs_Q15_visible(false);
              setIs_Q16_visible(false);
            } else {
              setIs_Q17_visible(false);
              setIs_Q18_visible(false);
              setIs_Q19_visible(false);
              setIs_Q20_visible(false);
            }
          }};
          

          
        const handle_Q9_Changed = (e) => {
          const value = e.target.value;
          if (e.target.checked) {
            stValue_q9((prev) => [...prev, value]);
          } else {
            stValue_q9((prev) => prev.filter((item) => item !== value));
            if (value === 'option9') setTextInputQ9(''); // Clear text input for option9
          }
        };
        
        const handle_Q11_Changed = (e) => {
          const value = e.target.value;
          if (e.target.checked) {
            stValue_q11((prev) => [...prev, value]);
          } else {
            stValue_q11((prev) => prev.filter((item) => item !== value));
            if (value === 'option21') setTextInputQ11(''); // Clear text input for option11
          }
        };
        
        const handle_Q13_Changed = (e) => {
          const value = e.target.value;
          if (e.target.checked) {
            stValue_q13((prev) => [...prev, value]);
          } else {
            stValue_q13((prev) => prev.filter((item) => item !== value));
            if (value === 'option11') setTextInputQ13(''); // Clear text input for option11
          }
        };
        
    
        const handle_Q15_Changed =  (e) => {
          const value = e.target.value;
          if (e.target.checked) {
            // Add the value to the array if checked
            stValue_q15(prev => [...prev, value]);
          } else {
            // Remove the value from the array if unchecked
            stValue_q15(prev => prev.filter(item => item !== value));
          }
          console.log(value_q15);};

        
        const handle_Q16_Changed =  (e) => { 
          stValue_q16(e.target.value);
          console.log(e.target.value);
          if(isUserReviewing == false){
            if(e.target.value != "" && value_q8 != ""){
              setIs_Q17_visible(true);
              setIs_Q18_visible(true);
              setIs_Q19_visible(true);
              setIs_Q20_visible(true);

              setIs_Q8_visible(false);
              setIs_Q9_visible(false);
              setIs_Q11_visible(false);
              setIs_Q13_visible(false);
              setIs_Q15_visible(false);
              setIs_Q16_visible(false);
            } else {
              setIs_Q17_visible(false);
              setIs_Q18_visible(false);
              setIs_Q19_visible(false);
              setIs_Q20_visible(false);
            } } };
          
        const handle_Q17_Changed =  (e) => { 
          stValue_q17(e.target.value); 
          console.log(e.target.value);
          if(isUserReviewing == false){
            if(e.target.value != ""&& value_q18 != "" && value_q20 != "" ){
                  
            setIs_Q26_visible(true);
            setIs_Q27_visible(true); 
            setIs_Q17_visible(false);
            setIs_Q18_visible(false);
            setIs_Q19_visible(false);
            setIs_Q20_visible(false);
          } else {
            setIs_Q26_visible(false);
            setIs_Q27_visible(false);
          
          } } };
    
        const handle_Q18_Changed =  (e) => { 
          stValue_q18(e.target.value);
          console.log(e.target.value); 
          if(isUserReviewing == false){
            if(e.target.value != ""&& value_q17 != "" && value_q20 != "" ){
                  
            setIs_Q26_visible(true);
            setIs_Q27_visible(true); 
            setIs_Q17_visible(false);
            setIs_Q18_visible(false);
            setIs_Q19_visible(false);
            setIs_Q20_visible(false);
          } else {
            setIs_Q26_visible(false);
            setIs_Q27_visible(false);
          
          } } };

        const handle_Q19_Changed =  (e) => { 
          const value = e.target.value;
          if (e.target.checked) {
            // Add the value to the array if checked
            stValue_q19(prev => [...prev, value]);
          } else {
            // Remove the value from the array if unchecked
            stValue_q19(prev => prev.filter(item => item !== value));
          }
          console.log(value_q19);};



        const handle_Q20_Changed =  (e) => { 
          stValue_q20(e.target.value);
          console.log(e.target.value); 
          if(isUserReviewing == false){
            if(e.target.value != ""&& value_q18 != "" && value_q17 != "" ){
                  
            setIs_Q26_visible(true);
            setIs_Q27_visible(true); 
            setIs_Q17_visible(false);
            setIs_Q18_visible(false);
            setIs_Q19_visible(false);
            setIs_Q20_visible(false);
          } else {
            setIs_Q26_visible(false);
            setIs_Q27_visible(false);
          
          } }};

        const handle_Q26_Changed =  (e) => {
          stValue_q26(e.target.value);
          console.log(e.target.value);
          if(isUserReviewing == false){
            if(e.target.value != "" && value_q27 != ""){
              if(value_q27 != "option1"){
                setIs_Q42_visible(true);
                setIs_Q28_visible(true);}
              else{setIs_Q42_visible(true);
              setIs_Q28_visible(false);}
            } else {
              setIs_Q42_visible(false);
            }}};
        
        const handle_Q27_Changed =  (e) => {
          stValue_q27(e.target.value);
          console.log(e.target.value);
          if(isUserReviewing == false){
            if(e.target.value != "" && value_q26 != ""){
              if(e.target.value != "option1"){
                setIs_Q42_visible(true);
                setIs_Q28_visible(true);}
              else{setIs_Q42_visible(true);
              setIs_Q28_visible(false);}
            } else {
              setIs_Q42_visible(false);
            }}};

        const handle_feedback_Changed = (e) => {
          setFeedback(e.target.value); 
          }
          
        const handle_feedback_Changed2 = (e) => {
          setFeedback2(e.target.value); 
          }
        
        const handle_feedback_Changed3 = (e) => {
          setFeedback3(e.target.value); 
          }
            
        const handleQ9TextChanged = (e) => {
          setTextInputQ9(e.target.value);
        };
        
        const handleQ11TextChanged = (e) => {
          setTextInputQ11(e.target.value);
        };
        
        const handleQ13TextChanged = (e) => {
          setTextInputQ13(e.target.value);
        };
          

                
    const reviewButtonChanged =  (e) => { 
      e.preventDefault()
      setIsUserReviewing(true);
      setIs_Q24_1_visible(true);
      setIs_Q24_2_visible(true);
      setIs_Q24_3_visible(true);
      setIs_Q24_4_visible(true);
      setIs_Q24_5_visible(true);
      setIs_Q25_visible(true);
      setIs_Q25_1_visible(true);
      setIs_Q25_2_visible(true);
      setIs_Q29_visible(true);
      setIs_Q1_visible(true);
      setIs_review_is_onward(true);
      setIs_Q8_visible(true);
      setIs_Q9_visible(true);
      setIs_Q11_visible(true);
      setIs_Q13_visible(true);
      setIs_Q15_visible(true);
      setIs_Q16_visible(true);
      setIs_Q17_visible(true);
      setIs_Q18_visible(true);
      setIs_Q19_visible(true);
      setIs_Q20_visible(true);
      setIs_Q26_visible(true);
      setIs_Q27_visible(true);
      if(value_q27 != "option1"){setIs_Q28_visible(true);}else{setIs_Q28_visible(false);}
      setIs_Q42_visible(true);
      setIs_TestingFeedBack_visible(false);
                
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            };

  const handleClick = async (e) => {
      e.preventDefault()
  
  var feedback = ""
    
  try{
    feedback = document.getElementById('feedback').value;
    
  } catch (err) {
    console.log(err);
    
  }
     //window.scrollTo({ top: 0, left: 0, behavior: "auto" })
     document.querySelector('body').scrollIntoView({ behavior: 'smooth' });
     window.scroll(0, 0);
    var someelse = ""
  
    //if(username.toLowerCase() != currentUser.username.toLowerCase()){
     // toast.error("Question 1. Sie haben einen falschen Benutzernamen eingegeben!");
      //return
    //}else 
    console.log("value_q15");
     console.log(value_q15);
    
    if(is_NoSurvey_visible == false){

      if (value_q1 == ""){ 
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q2 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q3 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q4 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q5 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q6 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q7 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q8 == ""){
        toast.error("Pitanje 9. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q9 == ""){
        toast.error("Pitanje 10. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q10 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q11 == ""){
        toast.error("Pitanje 11. Molimo izaberite jednu od ponuđenih opcija!");
        return
      } else if (value_q12 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q13 == ""){
        toast.error("Pitanje 12. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q14 == ""){
        toast.error("Pitanje 8. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q15 == ""){
        toast.error("Pitanje 13. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q16 == ""){
        toast.error("Pitanje 14. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q17 == ""){
        toast.error("Pitanje 15. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q18 == ""){
        toast.error("Pitanje 16. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q19 == ""){
        toast.error("Pitanje 17. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q20 == ""){
        toast.error("Pitanje 18. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q24_1 == ""){
        toast.error("Pitanje 1. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q24_2 == ""){
        toast.error("Pitanje 2. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q24_3 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q24_4 == ""){
        toast.error("Pitanje 4. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q24_5 == ""){
        toast.error("Pitanje 5. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q25 == ""){
        toast.error("Pitanje 6. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q25_1 == ""){
        toast.error("Pitanje 6. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q25_2 == ""){
        toast.error("Pitanje 6. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q26 == ""){
        toast.error("Pitanje 19. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q27 == ""){
        toast.error("Pitanje 20. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_1 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_2 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_3 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_4 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_5 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_6 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }else if (value_q29_7 == ""){
        toast.error("Pitanje 3. Molimo izaberite jednu od ponuđenih opcija!");
        return
      }
      var survey = {}
      if(is_NoSurvey_visible == false){

      survey = {
        q1: value_q24_1,
        q2: value_q24_2,
        q3: value_q24_3,
        q4: value_q24_4,
        q5: value_q24_5,
        q6: value_q25,
        q6_1: value_q25_1,
        q6_2: value_q25_2, 
        q7_1: value_q29_1, 
        q7_2: value_q29_2,
        q7_3: value_q29_3,
        q7_4: value_q29_4,
        q7_5: value_q29_5,
        q7_6: value_q29_6,
        q7_7: value_q29_7,
        q8_1: value_q1,
        q8_2: value_q2,
        q8_3: value_q3,
        q8_4: value_q4,
        q8_5: value_q5,
        q8_6: value_q6,
        q8_7: value_q7,
        q8_8: value_q10,
        q8_9: value_q12,
        q8_10: value_q14,
        q9: value_q8,
        q10: value_q9.map((item) => (item === 'option9' ? `${item}: ${textInputQ9}` : item)).join(', '),
        q11: value_q11.map((item) => (item === 'option21' ? `${item}: ${textInputQ11}` : item)).join(', '),
        q12: value_q13.map((item) => (item === 'option11' ? `${item}: ${textInputQ13}` : item)).join(', '),
        q13: value_q15.join(', '),
        q14: value_q16,
        q15: value_q17,
        q16: value_q18,
        q17: value_q19.join(', '),
        q18: value_q20,
        q19: value_q26,
        q20: value_q27,
        q21: feedback2,
        "feedback": feedback3
      };
      
      
      
      
      
    } else {
      survey = {
        "feedback": feedback,
      };
    }
    try {
      setProgress(30);
      console.log(survey)
      let uniqueId = currentUser.uniqueId;
      console.log(currentUser)
      const token = localStorage.getItem('token');
      const res = await axios.post(`/postsurvey/pstsurvey/${currentUser._id}`, {uniqueId, survey, headers: { 'auth-token': token }});

      try {
        console.log(survey)
        //const res = await axios.post(`/idstorage/getKey/${currentUser.uniqueId}`);
        //console.log(res);
        
        //const urlParts = window.location.pathname.split('/');
        //const valu = urlParts[urlParts.length-1]
        //window.open('https://survey.maximiles.com/static-complete?p=123929_0b2e7809', '_blank');
        
        const surveyUrl = `https://app.prolific.com/submissions/complete?${res.data.message}`;

        window.open(surveyUrl, '_blank');
        set_Is_code_visible(true) 
        setIsSurveySubmitted(true)
        stStatus_msg2(res.data.message);
        setIs_Q1_visible(false);
        setIs_Q2_visible(false);
        setIs_Q3_visible(false);
        setIs_Q4_visible(false);
        setIs_review_is_onward(false);
        setIs_Q5_visible(false);
        setIs_Q6_visible(false);
        setIs_Q7_visible(false);
        setIs_Q8_visible(false);
        setIs_Q9_visible(false);
        setIs_Q10_visible(false);
        setIs_Q11_visible(false);
        setIs_Q12_visible(false); 
        setIs_Q13_visible(false);
	      setIs_Q14_visible(false);
        setIs_Q15_visible(false); 
        setIs_Q16_visible(false); 
        setIs_Q17_visible(false);
        setIs_Q18_visible(false);
        setIs_Q19_visible(false);
        setIs_Q20_visible(false);
        setIs_Q24_1_visible(false);
        setIs_Q24_2_visible(false);
        setIs_Q24_3_visible(false);
        setIs_Q24_4_visible(false);
        setIs_Q24_5_visible(false);
        setIs_Q25_visible(false);
        setIs_Q25_1_visible(false);
        setIs_Q25_2_visible(false);
        setIs_Q26_visible(false);
        setIs_Q27_visible(false);
        setIs_Q28_visible(false);
        setIs_Q29_visible(false);
        setIs_Q42_visible(false);
        setIs_TestingFeedBack_visible(false);
        
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setProgress(100);
        //history.push(`/register/${res.data.key}`);
      } catch (err) {
        console.log(err);
        setPasswordErr({A_user_with});
        setIsSurveySubmitted(false)
        setProgress(100);

      }

    } catch (err) {
      console.log(err);
      setPasswordErr({A_user_with});
      setIsSurveySubmitted(false)

    }

        
  }
};

  useEffect(() => {
      setFollowed(currentUser.followings.includes(usr._id));
        //setSelectedImage(usr.profilePicture);
        setPreImage(usr.profilePicture);
    }, []);


   return (
        <>
        <Topbar isProfile="true"  showRefreshIcon={false}/>
        <ToastContainer></ToastContainer>
        <div className={classes.profile}>
          <div className={classes.profileRight}>
            <div className={classes.profileRightTop}>
              <div className={classes.profileCover}>
                <img
                  className={classes.profileCoverImg}
                  src={usr.coverPicture ? PF+usr.coverPicture : PF+"person/noCover.png"}
                  alt=""
                />
                <img id='profileImg'
                  className={classes.profileUserImg}
                  src={usr.profilePicture ? PF + usr.profilePicture : PF+"person/noAvatar.png"}
                  alt=""
                />
              </div>
              <div className={classes.profileInfo}>
              {usr.username !== currentUser.username }
                <h4 className={classes.profileInfoName}>{usr.username} </h4>
               </div>
            </div>
        </div>
        </div>
        
        <div style={{ alignItems: "center", marginLeft: isMobileDevice && isTabletDevice && '300px', marginRight:isMobileDevice && isTabletDevice &&"300px"}}>
       

        <CSSTransition in={is_TestingFeedBack_visible} timeout={1000} classNames="slide" unmountOnExit> 
        <div id='feedback2' >
        <p className={classes.secon_disclaimor}>{"Please report any issues that you found"}</p>
        <textarea  className={classes.label2} id="feedback" rows={4}  onChange={handle_feedback_Changed}  value={feedback} placeholder={"Provide your feedback about the pre-survey here. A text area for feedback will also be available in the post-survey. Additionally, feel free to use these text fields to mention any other concerns or issues. You can also leave comments to highlight any problems encountered on the platform."}/>
        </div> 
        </CSSTransition>
        
        <CSSTransition in={is_Q24_1_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q24_1'> 
        <p className={classes.secon_disclaimor}>{post_q24_1}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q24_1 === 'option1'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q24_1 === 'option2'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q24_1 === 'option3'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q24_1 === 'option4'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q24_1 === 'option5'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op5}</span></label></div> 
        <div className={classes.label}><label ><input type="radio" value="option6"  checked={value_q24_1 === 'option6'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op6}</span></label></div> 
        <div className={classes.label}><label ><input type="radio" value="option7"  checked={value_q24_1 === 'option7'} onChange={handle_Q24_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_1_op7}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q24_2_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q24_2'> 
        <p className={classes.secon_disclaimor}>{post_q24_2}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q24_2 === 'option1'} onChange={handle_Q24_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_2_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q24_2 === 'option2'} onChange={handle_Q24_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_2_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q24_2 === 'option3'} onChange={handle_Q24_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_2_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q24_2 === 'option4'} onChange={handle_Q24_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_2_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q24_2 === 'option5'} onChange={handle_Q24_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_2_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q24_3_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q24_3'> 
        <p className={classes.secon_disclaimor}>{post_q24_3}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q24_3 === 'option1'} onChange={handle_Q24_3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_3_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q24_3 === 'option2'} onChange={handle_Q24_3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_3_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q24_3 === 'option3'} onChange={handle_Q24_3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_3_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q24_3 === 'option4'} onChange={handle_Q24_3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_3_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q24_3 === 'option5'} onChange={handle_Q24_3_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_3_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q24_4_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q24_4'> 
        <p className={classes.secon_disclaimor}>{post_q24_4}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q24_4 === 'option1'} onChange={handle_Q24_4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_4_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q24_4 === 'option2'} onChange={handle_Q24_4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_4_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q24_4 === 'option3'} onChange={handle_Q24_4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_4_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q24_4 === 'option4'} onChange={handle_Q24_4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_4_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q24_4 === 'option5'} onChange={handle_Q24_4_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_4_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q24_5_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q24_5'> 
        <p className={classes.secon_disclaimor}>{post_q24_5}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q24_5 === 'option1'} onChange={handle_Q24_5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_5_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q24_5 === 'option2'} onChange={handle_Q24_5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_5_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q24_5 === 'option3'} onChange={handle_Q24_5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_5_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q24_5 === 'option4'} onChange={handle_Q24_5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_5_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q24_5 === 'option5'} onChange={handle_Q24_5_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q24_5_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q25_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q25'>
        <p className={classes.secon_disclaimor}>{post_q25_0}</p> 
        <br /> 
        <p className={classes.secon_disclaimor}>{post_q25}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q25 === 'option1'} onChange={handle_Q25_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q25 === 'option2'} onChange={handle_Q25_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q25 === 'option3'} onChange={handle_Q25_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q25 === 'option4'} onChange={handle_Q25_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q25 === 'option5'} onChange={handle_Q25_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q25_1_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q25_1'> 
        <p className={classes.secon_disclaimor}>{post_q25_1}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q25_1 === 'option1'} onChange={handle_Q25_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_1_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q25_1 === 'option2'} onChange={handle_Q25_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_1_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q25_1 === 'option3'} onChange={handle_Q25_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_1_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q25_1 === 'option4'} onChange={handle_Q25_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_1_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q25_1 === 'option5'} onChange={handle_Q25_1_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_1_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q25_2_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q25_2'> 
        <p className={classes.secon_disclaimor}>{post_q25_2}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q25_2 === 'option1'} onChange={handle_Q25_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_2_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q25_2 === 'option2'} onChange={handle_Q25_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_2_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q25_2 === 'option3'} onChange={handle_Q25_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_2_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q25_2 === 'option4'} onChange={handle_Q25_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_2_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q25_2 === 'option5'} onChange={handle_Q25_2_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q25_2_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q29_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q29'>
          <p className={classes.secon_disclaimor}>{post_q29_0}</p>  
          <br />
          <p className={classes.secon_disclaimor}>{post_q29}</p>  
          
          <div className={classes.tableContainer}>
            <table className={classes.questionTable}>
              <thead>
                <tr>
                  <th style={{width: '40%'}}></th> {/* For question text */}
                  <th colSpan="7" style={{textAlign: 'center'}}>
                    <div className={classes.scaleLabels}>
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                      <span>7</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row for Q29_1 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_1_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_1" value="option1_1" checked={value_q29_1 === 'option1_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option2_1" checked={value_q29_1 === 'option2_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option3_1" checked={value_q29_1 === 'option3_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option4_1" checked={value_q29_1 === 'option4_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option5_1" checked={value_q29_1 === 'option5_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option6_1" checked={value_q29_1 === 'option6_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_1" value="option7_1" checked={value_q29_1 === 'option7_1'} onChange={handle_Q29_1_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_1_op7}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Row for Q29_2 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_2_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_2" value="option1_2" checked={value_q29_2 === 'option1_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option2_2" checked={value_q29_2 === 'option2_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option3_2" checked={value_q29_2 === 'option3_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option4_2" checked={value_q29_2 === 'option4_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option5_2" checked={value_q29_2 === 'option5_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option6_2" checked={value_q29_2 === 'option6_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_2" value="option7_2" checked={value_q29_2 === 'option7_2'} onChange={handle_Q29_2_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_2_op7}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Row for Q29_3 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_3_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_3" value="option1_3" checked={value_q29_3 === 'option1_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option2_3" checked={value_q29_3 === 'option2_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option3_3" checked={value_q29_3 === 'option3_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option4_3" checked={value_q29_3 === 'option4_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option5_3" checked={value_q29_3 === 'option5_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option6_3" checked={value_q29_3 === 'option6_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_3" value="option7_3" checked={value_q29_3 === 'option7_3'} onChange={handle_Q29_3_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_3_op7}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Row for Q29_4 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>{post_q29_4_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_4" value="option1_4" checked={value_q29_4 === 'option1_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option2_4" checked={value_q29_4 === 'option2_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option3_4" checked={value_q29_4 === 'option3_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option4_4" checked={value_q29_4 === 'option4_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option5_4" checked={value_q29_4 === 'option5_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option6_4" checked={value_q29_4 === 'option6_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_4" value="option7_4" checked={value_q29_4 === 'option7_4'} onChange={handle_Q29_4_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_4_op7}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Row for Q29_5 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_5_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_5" value="option1_5" checked={value_q29_5 === 'option1_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option2_5" checked={value_q29_5 === 'option2_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option3_5" checked={value_q29_5 === 'option3_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option4_5" checked={value_q29_5 === 'option4_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option5_5" checked={value_q29_5 === 'option5_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option6_5" checked={value_q29_5 === 'option6_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_5" value="option7_5" checked={value_q29_5 === 'option7_5'} onChange={handle_Q29_5_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_5_op7}</span>
                    </div>
                  </td>
                </tr>
                
                {/* Row for Q29_6 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_6_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_6" value="option1_6" checked={value_q29_6 === 'option1_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option2_6" checked={value_q29_6 === 'option2_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option3_6" checked={value_q29_6 === 'option3_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option4_6" checked={value_q29_6 === 'option4_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option5_6" checked={value_q29_6 === 'option5_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option6_6" checked={value_q29_6 === 'option6_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_6" value="option7_6" checked={value_q29_6 === 'option7_6'} onChange={handle_Q29_6_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_6_op7}</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_7_op1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q29_7" value="option1_7" checked={value_q29_7 === 'option1_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option2_7" checked={value_q29_7 === 'option2_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option3_7" checked={value_q29_7 === 'option3_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option4_7" checked={value_q29_7 === 'option4_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option5_7" checked={value_q29_7 === 'option5_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option6_7" checked={value_q29_7 === 'option6_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q29_7" value="option7_7" checked={value_q29_7 === 'option7_7'} onChange={handle_Q29_7_Changed} style={{"accentColor":'red'}} /></td>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q29_7_op7}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q1_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q1'>
          <p className={classes.secon_disclaimor}>{post_q1_0}</p>
          
          <div className={classes.tableContainer}>
            <table className={classes.questionTable}>
              <thead>
                <tr>
                  <th style={{width: '40%'}}></th> {/* For question text */}
                  <th colSpan="5" style={{textAlign: 'center'}}>
                    <div className={classes.scaleLabels}>
                      <span>{post_q1_op1}</span>
                      <span>{post_q1_op2}</span>
                      <span>{post_q1_op3}</span>
                      <span>{post_q1_op4}</span>
                      <span>{post_q1_op5}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row for Q1 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q1}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q1" value="option1" checked={value_q1 === 'option1'} onChange={handle_Q1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q1" value="option2" checked={value_q1 === 'option2'} onChange={handle_Q1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q1" value="option3" checked={value_q1 === 'option3'} onChange={handle_Q1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q1" value="option4" checked={value_q1 === 'option4'} onChange={handle_Q1_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q1" value="option5" checked={value_q1 === 'option5'} onChange={handle_Q1_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                
                {/* Row for Q2 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q2}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q2" value="option1" checked={value_q2 === 'option1'} onChange={handle_Q2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q2" value="option2" checked={value_q2 === 'option2'} onChange={handle_Q2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q2" value="option3" checked={value_q2 === 'option3'} onChange={handle_Q2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q2" value="option4" checked={value_q2 === 'option4'} onChange={handle_Q2_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q2" value="option5" checked={value_q2 === 'option5'} onChange={handle_Q2_Changed} style={{"accentColor":'red'}} /></td>
                </tr>

                {/* Row for Q3 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q3}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q3" value="option1" checked={value_q3 === 'option1'} onChange={handle_Q3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q3" value="option2" checked={value_q3 === 'option2'} onChange={handle_Q3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q3" value="option3" checked={value_q3 === 'option3'} onChange={handle_Q3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q3" value="option4" checked={value_q3 === 'option4'} onChange={handle_Q3_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q3" value="option5" checked={value_q3 === 'option5'} onChange={handle_Q3_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                {/* Row for Q4 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q4}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q4" value="option1" checked={value_q4 === 'option1'} onChange={handle_Q4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q4" value="option2" checked={value_q4 === 'option2'} onChange={handle_Q4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q4" value="option3" checked={value_q4 === 'option3'} onChange={handle_Q4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q4" value="option4" checked={value_q4 === 'option4'} onChange={handle_Q4_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q4" value="option5" checked={value_q4 === 'option5'} onChange={handle_Q4_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                {/* Row for Q5 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q5}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q5" value="option1" checked={value_q5 === 'option1'} onChange={handle_Q5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q5" value="option2" checked={value_q5 === 'option2'} onChange={handle_Q5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q5" value="option3" checked={value_q5 === 'option3'} onChange={handle_Q5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q5" value="option4" checked={value_q5 === 'option4'} onChange={handle_Q5_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q5" value="option5" checked={value_q5 === 'option5'} onChange={handle_Q5_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                {/* Row for Q6 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q6}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q6" value="option1" checked={value_q6 === 'option1'} onChange={handle_Q6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q6" value="option2" checked={value_q6 === 'option2'} onChange={handle_Q6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q6" value="option3" checked={value_q6 === 'option3'} onChange={handle_Q6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q6" value="option4" checked={value_q6 === 'option4'} onChange={handle_Q6_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q6" value="option5" checked={value_q6 === 'option5'} onChange={handle_Q6_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                {/* Row for Q7 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q7}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q7" value="option1" checked={value_q7 === 'option1'} onChange={handle_Q7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q7" value="option2" checked={value_q7 === 'option2'} onChange={handle_Q7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q7" value="option3" checked={value_q7 === 'option3'} onChange={handle_Q7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q7" value="option4" checked={value_q7 === 'option4'} onChange={handle_Q7_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q7" value="option5" checked={value_q7 === 'option5'} onChange={handle_Q7_Changed} style={{"accentColor":'red'}} /></td>
                </tr>
                {/* Row for Q10 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q10}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q10" value="option1" checked={value_q10 === 'option1'} onChange={handle_Q10_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q10" value="option2" checked={value_q10 === 'option2'} onChange={handle_Q10_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q10" value="option3" checked={value_q10 === 'option3'} onChange={handle_Q10_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q10" value="option4" checked={value_q10 === 'option4'} onChange={handle_Q10_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q10" value="option5" checked={value_q10 === 'option5'} onChange={handle_Q10_Changed} style={{"accentColor":'red'}} /></td>
                </tr>

                {/* Row for Q12 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q10}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q12" value="option1" checked={value_q12 === 'option1'} onChange={handle_Q12_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q12" value="option2" checked={value_q12 === 'option2'} onChange={handle_Q12_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q12" value="option3" checked={value_q12 === 'option3'} onChange={handle_Q12_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q12" value="option4" checked={value_q12 === 'option4'} onChange={handle_Q12_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q12" value="option5" checked={value_q12 === 'option5'} onChange={handle_Q12_Changed} style={{"accentColor":'red'}} /></td>
                </tr>

                {/* Row for Q14 */}
                <tr>
                  <td>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span>{post_q10}</span>
                    </div>
                  </td>
                  <td><input type="radio" name="q14" value="option1" checked={value_q14 === 'option1'} onChange={handle_Q14_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q14" value="option2" checked={value_q14 === 'option2'} onChange={handle_Q14_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q14" value="option3" checked={value_q14 === 'option3'} onChange={handle_Q14_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q14" value="option4" checked={value_q14 === 'option4'} onChange={handle_Q14_Changed} style={{"accentColor":'red'}} /></td>
                  <td><input type="radio" name="q14" value="option5" checked={value_q14 === 'option5'} onChange={handle_Q14_Changed} style={{"accentColor":'red'}} /></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div></SlideDiv>
        </CSSTransition>

        
        
        <CSSTransition in={is_Q8_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q8'> 
        <p className={classes.secon_disclaimor}>{post_q8_0}</p>
        <br />
        <p className={classes.secon_disclaimor}>{post_q8}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"  checked={value_q8 === 'option1'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q8 === 'option2'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q8 === 'option3'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q8 === 'option4'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q8 === 'option5'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op5}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option6"  checked={value_q8 === 'option6'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op6}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option7"  checked={value_q8 === 'option7'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op7}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option8"  checked={value_q8 === 'option8'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op8}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option9"  checked={value_q8 === 'option9'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op9}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option10"  checked={value_q8 === 'option10'} onChange={handle_Q8_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q8_op10}</span></label></div>
        <hr style={{ borderTop: '1px solid #000' }}/>
      
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q9_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q9'>
        <p className={classes.secon_disclaimor}>{post_q9}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="checkbox" value="option1"  checked={value_q9.includes('option1')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op1}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option2"  checked={value_q9.includes('option2')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op2}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option3"  checked={value_q9.includes('option3')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op3}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option4"  checked={value_q9.includes('option4')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op4}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option5"  checked={value_q9.includes('option5')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op5}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option6"  checked={value_q9.includes('option6')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op6}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option7"  checked={value_q9.includes('option7')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op7}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option8"  checked={value_q9.includes('option8')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op8}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option9" checked={value_q9.includes('option9')} onChange={handle_Q9_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q9_op9}</span></label></div>      
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q9_visible && value_q9.includes('option9')} timeout={1000} classNames="slide" unmountOnExit >
        <div id='Q9_text'>
          <textarea
            className={classes.label2}
            rows={4}
            value={textInputQ9}
            onChange={handleQ9TextChanged} // Use the new function here
            placeholder="Molimo precizirajte"
          />
        </div> 
        </CSSTransition>

        <CSSTransition in={is_Q11_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q11'>
        <p className={classes.secon_disclaimor}>{post_q11}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="checkbox" value="option1"   checked={value_q11.includes('option1')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op1}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option2"  checked={value_q11.includes('option2')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op2}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option3"  checked={value_q11.includes('option3')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op3}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option4"  checked={value_q11.includes('option4')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op4}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option5"  checked={value_q11.includes('option5')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op5}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option6"   checked={value_q11.includes('option6')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op6}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option7"  checked={value_q11.includes('option7')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op7}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option8"  checked={value_q11.includes('option8')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op8}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option9"  checked={value_q11.includes('option9')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op9}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option10"  checked={value_q11.includes('option10')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op10}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option11"   checked={value_q11.includes('option11')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op11}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option12"  checked={value_q11.includes('option12')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op12}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option13"  checked={value_q11.includes('option13')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op13}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option14"  checked={value_q11.includes('option14')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op14}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option15"  checked={value_q11.includes('option15')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op15}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option16"   checked={value_q11.includes('option16')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op16}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option17"  checked={value_q11.includes('option17')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op17}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option18"  checked={value_q11.includes('option18')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op18}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option19"  checked={value_q11.includes('option19')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op19}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option20"  checked={value_q11.includes('option20')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op20}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option21" checked={value_q11.includes('option21')} onChange={handle_Q11_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q11_op21}</span></label></div>

        </form>
        </div></SlideDiv>
        </CSSTransition>
        <CSSTransition in={is_Q11_visible && value_q11.includes('option21')} timeout={1000} classNames="slide" unmountOnExit >
        <div id='Q11_text'>
          <textarea
            className={classes.label2}
            rows={4}
            value={textInputQ11}
            onChange={handleQ11TextChanged} // Use the new function here
            placeholder="Molimo precizirajte"
          />
        </div> 
        </CSSTransition>
        
        <CSSTransition in={is_Q13_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q13'> 
        <p className={classes.secon_disclaimor}>{post_q13}</p>
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="checkbox" value="option1"   checked={value_q13.includes('option1')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op1}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option2"  checked={value_q13.includes('option2')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op2}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option3"  checked={value_q13.includes('option3')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op3}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option4"  checked={value_q13.includes('option4')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op4}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option5"  checked={value_q13.includes('option5')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op5}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option6"   checked={value_q13.includes('option6')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op6}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option7"  checked={value_q13.includes('option7')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op7}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option8"  checked={value_q13.includes('option8')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op8}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option9"  checked={value_q13.includes('option9')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op9}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option10"  checked={value_q13.includes('option10')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op10}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option11" checked={value_q13.includes('option11')} onChange={handle_Q13_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q13_op11}</span></label></div>

        </form>
        </div></SlideDiv>
        </CSSTransition>
        <CSSTransition in={is_Q13_visible && value_q13.includes('option11')} timeout={1000} classNames="slide" unmountOnExit >
        <div id='Q13_text'>
          <textarea
            className={classes.label2}
            rows={4}
            value={textInputQ13}
            onChange={handleQ13TextChanged} // Use the new function here
            placeholder="Molimo precizirajte"
          />
        </div> 
        </CSSTransition>
 
        <CSSTransition in={is_Q15_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q15'> 
        <p className={classes.secon_disclaimor}>{post_q15}</p> 
        
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="checkbox" value="option1"   checked={value_q15.includes('option1')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op1}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option2"  checked={value_q15.includes('option2')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op2}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option3"  checked={value_q15.includes('option3')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op3}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option4"  checked={value_q15.includes('option4')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op4}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option5"  checked={value_q15.includes('option5')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op5}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option6"  checked={value_q15.includes('option6')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op6}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option7"  checked={value_q15.includes('option7')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op7}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option8"  checked={value_q15.includes('option8')} onChange={handle_Q15_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q15_op8}</span></label></div>
        
        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q16_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q16'> 
        <p className={classes.secon_disclaimor}>{post_q16}</p> 
        
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q16 === 'option1'} onChange={handle_Q16_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q16_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q16 === 'option2'} onChange={handle_Q16_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q16_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q16 === 'option3'} onChange={handle_Q16_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q16_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q16 === 'option4'} onChange={handle_Q16_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q16_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q16 === 'option5'} onChange={handle_Q16_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q16_op5}</span></label></div>

        <hr style={{ borderTop: '1px solid #000' }}/>
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        
        <CSSTransition in={is_Q17_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q17'> 
        <p className={classes.secon_disclaimor}>{post_q17}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q17 === 'option1'} onChange={handle_Q17_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q17_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q17 === 'option2'} onChange={handle_Q17_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q17_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q17 === 'option3'} onChange={handle_Q17_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q17_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q17 === 'option4'} onChange={handle_Q17_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q17_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q17 === 'option5'} onChange={handle_Q17_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q17_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q18_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q18'> 
        <p className={classes.secon_disclaimor}>{post_q18}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q18 === 'option1'} onChange={handle_Q18_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q18_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q18 === 'option2'} onChange={handle_Q18_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q18_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q18 === 'option3'} onChange={handle_Q18_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q18_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q18 === 'option4'} onChange={handle_Q18_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q18_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q18 === 'option5'} onChange={handle_Q18_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q18_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q19_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q19'> 
        <p className={classes.secon_disclaimor}>{post_q19}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="checkbox" value="option1"   checked={value_q19.includes('option1')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op1}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option2"  checked={value_q19.includes('option2')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op2}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option3"  checked={value_q19.includes('option3')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op3}</span></label></div>
        <div className={classes.label}><label><input type="checkbox" value="option4"  checked={value_q19.includes('option4')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op4}</span></label></div>
        <div className={classes.label}><label ><input type="checkbox" value="option5"  checked={value_q19.includes('option5')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op5}</span></label></div> 
        <div className={classes.label}><label ><input type="checkbox" value="option6"  checked={value_q19.includes('option6')} onChange={handle_Q19_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q19_op6}</span></label></div> 
        
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q20_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q20'> 
        <p className={classes.secon_disclaimor}>{post_q20}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q20 === 'option1'} onChange={handle_Q20_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q20_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q20 === 'option2'} onChange={handle_Q20_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q20_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q20 === 'option3'} onChange={handle_Q20_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q20_op3}</span></label></div>
        <div className={classes.label}><label><input type="radio" value="option4"  checked={value_q20 === 'option4'} onChange={handle_Q20_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q20_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q20 === 'option5'} onChange={handle_Q20_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q20_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>

        <CSSTransition in={is_Q26_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q26'>
        <p className={classes.secon_disclaimor}><strong>{post_q26_0}</strong></p>
        <br />  
        <p className={classes.secon_disclaimor}>{post_q26}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q26 === 'option1'} onChange={handle_Q26_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q26_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q26 === 'option2'} onChange={handle_Q26_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q26_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q26 === 'option3'} onChange={handle_Q26_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q26_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q26 === 'option4'} onChange={handle_Q26_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q26_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q26 === 'option5'} onChange={handle_Q26_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q26_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q27_visible} timeout={1000} classNames="slide" unmountOnExit ><SlideDiv>
        <div id='Q27'>
        <p className={classes.secon_disclaimor}>{post_q27}</p>  
        <form  className={classes.question}>
        <div className={classes.label}><label><input type="radio" value="option1"   checked={value_q27 === 'option1'} onChange={handle_Q27_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q27_op1}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option2"  checked={value_q27 === 'option2'} onChange={handle_Q27_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q27_op2}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option3"  checked={value_q27 === 'option3'} onChange={handle_Q27_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q27_op3}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option4"  checked={value_q27 === 'option4'} onChange={handle_Q27_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q27_op4}</span></label></div>
        <div className={classes.label}><label ><input type="radio" value="option5"  checked={value_q27 === 'option5'} onChange={handle_Q27_Changed} style={{"accent-color":'red'}}/><span style={{"margin-left": "0.5rem"}}>{post_q27_op5}</span></label></div> 
        </form>
        </div></SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q28_visible} timeout={1000} classNames="slide" unmountOnExit >

        <div id='Q28'>
        <p className={classes.secon_disclaimor}>{post_q28}</p>
        <textarea className={classes.label2} id="Polje" rows={4} onChange={handle_feedback_Changed2}  value={feedback2} placeholder={"Polje za tekst"}/>
        </div> 
        </CSSTransition>

        <CSSTransition in={is_Q42_visible} timeout={1000} classNames="slide" unmountOnExit >
        <SlideDiv>
        <div id='Q42_0'>
        
        {/*<p className={classes.secon_disclaimor}>{last_info1}</p>*/}
        <p className={classes.secon_disclaimor}>{last_info2}</p>
        <p className={classes.secon_disclaimor}>{last_info3}</p>
        <p className={classes.secon_disclaimor}>{last_info4}</p>
        
        <p className={classes.secon_disclaimor}><a href={last_info5} target={last_info5} rel="noopener noreferrer">{last_info5}</a></p>
        
        
        <hr style={{ borderTop: '1px solid #000' }}/>
        </div>
        </SlideDiv>
        </CSSTransition>
        
        <CSSTransition in={is_Q42_visible} timeout={1000} classNames="slide" unmountOnExit > 
        <div id='Q42'>
        {!is_NoSurvey_visible && (<p className={classes.secon_disclaimor}>{post_q42}</p>)}

        {!is_NoSurvey_visible && (<textarea  className={classes.label2} id="Polje2" rows={4} onChange={handle_feedback_Changed3}  value={feedback3} placeholder={""}/>)}

        {!is_NoSurvey_visible && (<button onClick={reviewButtonChanged} disabled={isButtonDisabled} className={classes.button}>izmenite odgovore</button>)}
           
				<button onClick={handleClick} type="submit" className={classes.button}> {Submit_Post_Survey} </button>
        </div> 
        </CSSTransition>

</div>
        
      </>
    );
  }

export default withStyles(styles)(Postsurvey);
