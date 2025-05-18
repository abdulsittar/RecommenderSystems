import React from 'react';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useParams } from 'react-router';
import { Add, Remove } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './progressStyle';
import { useMediaQuery } from 'react-responsive';
import TextField from '@material-ui/core/TextField'
import { colors } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useHistory } from "react-router";
import { ToastContainer } from 'react-toastify';
import {regSw, subscribe} from '../../helper.js';
import { Link } from 'react-router-dom';
import { Line, Circle } from 'rc-progress';
import { CSSTransition } from 'react-transition-group';
import { useScrollBy } from "react-use-window-scroll";
import {A_user_with, Submit_Post_Survey, Progress_Day_1, Progress_Day_2, Progress_Day_3, Progress_Day_4, Progress_Day_5, post_q4_1, post_q4_2, post_q4_3, post_q4_4, post_q4_5, post_info_0, post_info_1,post_q1,post_info_2,post_q2, post_q2_op1,post_q2_op2,post_q2_op3, post_q2_op4,post_q2_op5 ,post_q3 ,post_q3_op1 , post_q3_op2 , post_q3_op3 ,post_q3_op4 ,post_q3_op5 , post_info_3 , post_info_4 , post_q4 ,post_q4_op1 ,post_q4_op2 ,post_q4_op3 , post_q4_op4,post_q4_op5 ,post_q4_op6 ,post_q4_op7 ,post_q5_op1 ,post_q5_op2  ,post_q5_op3 ,post_q5_op4 ,post_q5_op5 ,post_q5_op6,post_q5_op7,post_q6_op1 ,post_q6_op2 ,post_q6_op3 ,post_q6_op4 ,post_q6_op5 ,post_q6_op6 ,post_q6_op7 ,post_q7_op1 ,post_q7_op2 ,post_q7_op3 ,post_q7_op4 ,post_q7_op5 ,post_q7_op6 ,post_q7_op7 ,post_q8_op1 , post_q8_op2,post_q8_op3 ,post_q8_op4 ,post_q8_op5 ,post_q8_op6 , post_q8_op7, post_q9_op1, post_q9_op2, post_q9_op3,post_q9_op4 ,post_q9_op5 ,post_q9_op6 , post_q9_op7, post_info_5,post_q10 ,post_q10_op1 ,post_q10_op2,post_q10_op3 ,post_q10_op4 ,post_q10_op5 ,post_q11 ,post_q11_op1 ,post_q11_op2 ,post_q11_op3 ,post_q11_op4,post_q11_op5 ,post_q12 ,post_q12_op1 ,post_q12_op2 ,post_q12_op3 ,post_q12_op4 ,post_q12_op5 ,post_q13 ,post_q13_op1 ,post_q13_op2 , post_q13_op3,post_q13_op4 , post_q13_op5,post_info_6 ,post_q14 ,post_q14_op1 ,post_q14_op2 ,post_q14_op3 , post_q14_op4,post_q14_op5 ,post_q15 ,post_q15_op1, post_q15_op2, post_q15_op3, post_q15_op4,post_q15_op5 ,post_q16 , post_q16_op1,post_q16_op2 ,post_q16_op3 ,post_q16_op4 ,post_q16_op5 ,post_q17 , post_q17_op1, post_q17_op2, post_q17_op3, post_q17_op4, post_q17_op5,post_info_7 ,post_q18, post_info_8 } from '../../constants';


function Progress({ classes }) {
    
  const scrollBy = useScrollBy();
    const [selectedImage, setSelectedImage] = useState(null);
    const [preImage, setPreImage] = useState(null);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [bio, setBio] = useState("");
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
    
    const [day_One_Percent, setDay_One_Percent] = useState(0);
    const [day_Two_Percent, setDay_Two_Percent] = useState(0);
    const [day_Three_Percent, setDay_Three_Percent] = useState(0);
    const [day_Four_Percent, setDay_Four_Percent] = useState(0);
    const [day_Five_Percent, setDay_Five_Percent] = useState(0);

    const [passwordErr, setPasswordErr] = useState('');

    const [isVisible, setIsVisible] = useState(false);
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const [status_msg, stStatus_msg] = useState("Sie sind nicht berechtigt, an der Nachbefragung teilzunehmen. ");
    const [status_msg2, stStatus_msg2] = useState("Herzlichen Glückwunsch!!! Sie sind jetzt berechtigt, an der Nachbefragung teilzunehmen. ");
    
    const [value_q2, stValue_q2] = useState('');
    const [value_q3, stValue_q3] = useState('');
    const [value_q4, stValue_q4] = useState('');
    const [value_b_q4, stValue_b_q4] = useState('');

    const [value_q4_1, stValue_q4_1] = useState('');
    const [value_q4_2, stValue_q4_2] = useState('');
    const [value_q4_3, stValue_q4_3] = useState('');
    const [value_q4_4, stValue_q4_4] = useState('');
    const [value_q4_5, stValue_q4_5] = useState('');

    const [value_q10, stValue_q10] = useState('');
    const [value_q11, stValue_q11] = useState('');
    const [value_q12, stValue_q12] = useState('');
    const [value_q13, stValue_q13] = useState('');
    const [value_q14, stValue_q14] = useState('');
    const [value_q15, stValue_q15] = useState('');
    const [value_q16, stValue_q16] = useState('');
    const [value_q17, stValue_q17] = useState('');


  const [is_Q2_visible, setIs_Q2_visible] = useState(false);
  const [is_Q3_visible, setIs_Q3_visible] = useState(false);
  const [is_Q4_visible, setIs_Q4_visible] = useState(false);
  const [is_Q4_b_visible, setIs_Q4_b_visible] = useState(false);
  
  const [is_Q5_visible, setIs_Q5_visible] = useState(false);
  const [is_Q6_visible, setIs_Q6_visible] = useState(false);
  const [is_Q7_visible, setIs_Q7_visible] = useState(false);
  const [is_Q8_visible, setIs_Q8_visible] = useState(false);
  const [is_Q9_visible, setIs_Q9_visible] = useState(false);
  const [is_Q10_visible, setIs_Q10_visible] = useState(false);
  const [is_Q11_visible, setIs_Q11_visible] = useState(false);
  const [is_Q12_visible, setIs_Q12_visible] = useState(false);
  const [is_Q13_visible, setIs_Q13_visible] = useState(false);
  const [is_Q14_visible, setIs_Q14_visible] = useState(false);
  const [is_Q15_visible, setIs_Q15_visible] = useState(false);
  const [is_Q16_visible, setIs_Q16_visible] = useState(false);
  const [is_Q17_visible, setIs_Q17_visible] = useState(false);
  const [is_Q18_visible, setIs_Q18_visible] = useState(false);
    

useEffect(() => {
  const token = localStorage.getItem('token');
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
  setIsProfileFetched(false);

  if(day_One_Percent > 10){
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
    const res = await axios.get("/users/" + currentUser._id + "/getUserActions", {headers: { 'auth-token': token }})
    console.log(res.data);
    
    
    
    if(res.data["showAlert"] == "third"){
      history.push(`/postsurvey/${currentUser.username}`);
          //setDay_One_Percent(100);
          //setDay_Two_Percent(100);
          //setDay_Three_Percent(100);
          //setDay_Four_Percent(100);
          //setDay_Five_Percent(100);
        }
    
        
        //if(res.data["showAlert"] == "no"){
         // setDay_One_Percent(0);
         // setDay_Two_Percent(0);
         // setDay_Three_Percent(0);
         // setDay_Four_Percent(0);
         // setDay_Five_Percent(0);
      //}

  };


const calculatePercentage = (numerator, denominator) => {
  // Ensure denominator is not 0 to avoid division by zero error
  if (denominator !== 0) {
    const perct = (numerator/denominator) * 100
    console.log(numerator)
    console.log(denominator)
    console.log(perct)
    if(perct > 100){
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
        scrollBy({ top: 500, left: 0, behavior: "smooth" })
      }
      setIs_Q2_visible(true);
      
    }else{
      setIs_Q2_visible(false);
    }
}

  const handle_Q2_Changed = async (e) => { stValue_q2(e.target.value); 
    if(e.target.value != ""){
    setIs_Q3_visible(true);
    scrollBy({ top: 500, left: 0, behavior: "smooth" })

  } else {
    setIs_Q3_visible(false);
  }  };
  const handle_Q3_Changed = async (e) => { stValue_q3(e.target.value); 
    if(e.target.value != ""){
      setIs_Q4_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q4_visible(false);
    }  };

    const handle_Q4_Changed = async (e) => { stValue_q4(e.target.value); 
      if(e.target.value != ""){
        setIs_Q5_visible(true);
        scrollBy({ top: 500, left: 0, behavior: "smooth" })
  
      } else {
        setIs_Q5_visible(false);
      }  
      };

  const handleTechnicalChange = async (e) => { stValue_b_q4(e.target.value); 

    if(e.target.value != ""){
      setIs_Q4_b_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q4_b_visible(false);
    }  
    };

    const handle_Q4_1_Changed = async (e) => { stValue_q4_1(e.target.value); 
      if(e.target.value != ""){
        setIs_Q6_visible(true);
        scrollBy({ top: 500, left: 0, behavior: "smooth" })
  
      } else {
        setIs_Q6_visible(false);
      }  };

  const handle_Q4_2_Changed = async (e) => { stValue_q4_2(e.target.value);
    if(e.target.value != ""){
      setIs_Q7_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q7_visible(false);
    }   };
  const handle_Q4_3_Changed = async (e) => { stValue_q4_3(e.target.value); 
    if(e.target.value != ""){
      setIs_Q8_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q8_visible(false);
    }  };
  const handle_Q4_4_Changed = async (e) => { stValue_q4_4(e.target.value);
    if(e.target.value != ""){
      setIs_Q9_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q9_visible(false);
    }   };
  const handle_Q4_5_Changed = async (e) => { stValue_q4_5(e.target.value); 
    if(e.target.value != ""){
      setIs_Q10_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q10_visible(false);
    }  };

  const handle_Q10_Changed = async (e) => { stValue_q10(e.target.value); 
    if(e.target.value != ""){
      setIs_Q11_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q11_visible(false);
    }  };
  const handle_Q11_Changed = async (e) => { stValue_q11(e.target.value); 
    if(e.target.value != ""){
      setIs_Q12_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q12_visible(false);
    }  };
  const handle_Q12_Changed = async (e) => { stValue_q12(e.target.value); 
    if(e.target.value != ""){
      setIs_Q13_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q13_visible(false);
    }  };
  const handle_Q13_Changed = async (e) => { stValue_q13(e.target.value); 
    if(e.target.value != ""){
      setIs_Q14_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q14_visible(false);
    }  };
  const handle_Q14_Changed = async (e) => { stValue_q14(e.target.value); 
    if(e.target.value != ""){
      setIs_Q15_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q15_visible(false);
    }  };
  const handle_Q15_Changed = async (e) => { stValue_q15(e.target.value); 
    if(e.target.value != ""){
      setIs_Q16_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q16_visible(false);
    }  };
  const handle_Q16_Changed = async (e) => { stValue_q16(e.target.value); 
    if(e.target.value != ""){
      setIs_Q17_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q17_visible(false);
    }  };
  const handle_Q17_Changed = async (e) => { stValue_q17(e.target.value); 
    if(e.target.value != ""){
      setIs_Q18_visible(true);
      scrollBy({ top: 500, left: 0, behavior: "smooth" })

    } else {
      setIs_Q18_visible(false);
    }  };


  const handleClick = async (e) => {

    e.preventDefault()
    const username = document.getElementById('username').value;
    const someelse = document.getElementById('someelse').value;
    
    if(username.toLowerCase() != currentUser.username.toLowerCase()){
      toast.error("Question 1. Sie haben einen falschen Benutzernamen eingegeben!");
      return
    }else if (value_q2 == ""){
      toast.error("Question 2. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q3 == ""){
      toast.error("Question 3. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4 == ""){
      toast.error("Question 4. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4_1 == ""){
      toast.error("Question 5. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4_2 == ""){
      toast.error("Question 6. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4_3 == ""){
      toast.error("Question 7. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4_4 == ""){
      toast.error("Question 8. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q4_5 == ""){
      toast.error("Question 9. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q10 == ""){
      toast.error("Question 10. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q11 == ""){
      toast.error("Question 11. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q12 == ""){
      toast.error("Question 12. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q13 == ""){
      toast.error("Question 13. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q14 == ""){
      toast.error("Question 14. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q15 == ""){
      toast.error("Question 15. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q16 == ""){
      toast.error("Question 16. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }else if (value_q17 == ""){
      toast.error("Question 17. Bitte wählen Sie eine vorgegebene Auswahl aus!");
      return
    }

    const survey = {
      q1: username,
      q2: value_q2,
      q3: value_q3,
      q4b: value_b_q4,
      q4: value_q4_1,
      q5: value_q4_2,
      q6: value_q4_3,
      q7: value_q4_4,
      q8: value_q4_5,
      q9: value_q10,
      q10: value_q11,
      q11: value_q12,
      q12: value_q13,
      q13: value_q14,
      q14: value_q15,
      q15: value_q16,
      q16: value_q17,
      q17: someelse,
    };
        try {
          console.log(survey)
          const token = localStorage.getItem('token');
          const res = await axios.get(`/idstorage/getKey/${currentUser.uniqueId}`, {headers: { 'auth-token': token }});
          console.log(res.data.key);
          
	        const urlParts = window.location.pathname.split('/');
          const valu = urlParts[urlParts.length-1]
          window.open('https://survey.maximiles.com/static-complete?p=123929_0b2e7809', '_blank');

          localStorage.removeItem("user");
          localStorage.removeItem("token");
	        history.push(`/register/${res.data.key}`);
	        
        } catch (err) {
          console.log(err);
          setPasswordErr({A_user_with});
  
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
              {usr.username !== currentUser.username /*&& (
          {<button className={classes.rightbarFollowButton} onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>}
        )*/}
                <h4 className={classes.profileInfoName}>{usr.username} </h4>
                {/*<textarea style= {{borderWidth: '1px', marginBottom: '10px'}} readOnly={!(usr.username == currentUser.username)} placeholder={usr.desc? usr.desc: "Enter your biography"} className={classes.shareInput} onChange={handleDescription}  />
                <input style= {{borderWidth: '1px', marginBottom: '10px'}} readOnly={!(usr.username == currentUser.username)} placeholder={usr.city? usr.city:"Enter the name of your City"} className={classes.shareInput} onChange={handleCity}   />
                <input style= {{borderWidth: '1px', marginBottom: '10px'}} readOnly={!(usr.username == currentUser.username)} placeholder={usr.from? usr.from:"Enter the name of your Country"} className={classes.shareInput} onChange={handleCountry}  />
                <input style= {{borderWidth: '1px', marginBottom: '10px'}} readOnly={!(usr.username == currentUser.username)} placeholder={usr.relationship? usr.relationship:"Whats is the status of your relationship?"} className={classes.shareInput} onChange={handleRelationship}  />*/}
              </div>
            </div>
        </div>
        </div>
        
        <div style={{ alignItems: "center", marginLeft: isMobileDevice && isTabletDevice && '300px', marginRight:isMobileDevice && isTabletDevice &&"300px"}}>
        <h3 className={classes.progressHead}>{(day_One_Percent > 50 && day_Two_Percent > 50 && day_Three_Percent > 50)?status_msg2: status_msg}
        {(day_One_Percent > 50 && day_Two_Percent > 50 && day_Three_Percent > 50)?
        <a onClick={(day_One_Percent > 50 && day_Two_Percent > 50 && day_Three_Percent > 50)? handleClick : undefined} style={{ color: (day_One_Percent > 50 && day_Two_Percent > 50 && day_Three_Percent > 50)? 'blue' : 'gray', cursor: (day_One_Percent > 50 && day_Two_Percent > 50 && day_Three_Percent > 50)? 'pointer' : 'not-allowed' }}>
          <Link to={`/postsurvey/${currentUser.username}`}>Link to the post survey</Link></a>: <div></div>}
        
        
        </h3></div>

          <div style= {{width: 'auto', marginLeft: isMobileDevice && isTabletDevice && '300px', marginRight: isMobileDevice && isTabletDevice && "300px"}}>

{/*
<h3 className={classes.progressHead}>{Progress_Day_1} = {day_One_Percent}%</h3>
<Line percent={day_One_Percent} strokeWidth={4} strokeColor={day_One_Percent < 50? "red": day_One_Percent < 30? "yellow": "green"} className={classes.progressVal}/>

<h3 className={classes.progressHead}>{Progress_Day_2} = {day_Two_Percent}%</h3>
<Line percent={day_Two_Percent} strokeWidth={4} strokeColor={day_Two_Percent < 50? "red": day_Two_Percent < 30? "yellow": "green"} className={classes.progressVal}/>

<h3 className={classes.progressHead}>{Progress_Day_3} = {day_Three_Percent}%</h3>
<Line percent={day_Three_Percent} strokeWidth={4} strokeColor={day_Three_Percent < 50? "red": day_Three_Percent < 30? "yellow": "green"} className={classes.progressVal}/>

<h3 className={classes.progressHead}>{Progress_Day_4} = {day_Four_Percent}%</h3>
<Line percent={day_Four_Percent} strokeWidth={4} strokeColor={day_Four_Percent < 50? "red": day_Four_Percent < 30? "yellow": "green"} className={classes.progressVal}/>

<h3 className={classes.progressHead}>{Progress_Day_5} = {day_Five_Percent}%</h3>
<Line percent={day_Five_Percent} strokeWidth={4} strokeColor={day_Five_Percent < 50? "red": day_Five_Percent < 30? "yellow": "green"} className={classes.progressVal}/>
*/}
  {/*<Circle percent={percent} strokeWidth={4} strokeColor="green" />*/}
</div>
        
      </>
    );
  }

export default withStyles(styles)(Progress);
