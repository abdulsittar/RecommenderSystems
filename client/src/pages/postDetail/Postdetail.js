import React from 'react';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import Post from "../../components/post/Post";
import { useParams } from 'react-router';
import {styles} from './PostdetailStyle';
import { colors } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from 'react-responsive';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";
import { useHistory } from "react-router";
import {COLORS} from '../../components/values/colors.js';
//import User from '../../../../server/models/User';
import TimeMe from "timeme.js";

function Postdetail({ classes }) {
  const history = useHistory();
  const {state} = useLocation();
  console.log(state);
  const [postObj, setPostObj] = useState(state?.myObj || {});
  const [selectedValue, setSelectedValue] = useState('0');
  const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)"});
  const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)"});
  const [shouldSendEvent, setShouldSendEvent] = useState(false);

  const { user: currentUser, dispatch } = useContext(AuthContext);
  const username = useParams().username;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem('token');
  const handleReadChange = () => {
    axios.put("/users/" + currentUser._id + "/read", { postId: state.myObj._id, headers: { 'auth-token': token } });
};

const updateStatus_State = async () => {
  try {
    // Fetch the post by its ID
    setProgress(30);
    const res = await axios.get(`/posts/${postObj._id}`, {
      headers: { "auth-token": token },
    });

    console.log("Fetched post data:", res.data);
    setPostObj(res.data); // Update state with the fetched post
    setProgress(100);
  } catch (error) {
    console.error("Error fetching post:", error);
    setProgress(100);
  }
};


const handleActivityRecorder = () => {
  axios.put("/users/" + currentUser._id + "/activity", { page: "DetailPage", seconds: TimeMe.getTimeOnCurrentPageInSeconds(), headers: { 'auth-token': token } });
};

  useEffect(() => {
    updateStatus_State();
  
    }, [username]);

    useEffect(() => {
      TimeMe.initialize({
        currentPageName: "DetailPage", // current page
        idleTimeoutInSeconds: 10 // seconds
        });
    
        TimeMe.callWhenUserLeaves(() => {
        setShouldSendEvent(true);
        //handleActivityRecorder();
        //handleReadChange();
        });
      
        TimeMe.callWhenUserReturns(() => {
        setShouldSendEvent(false);
        });
    
      }, []);

    /*useEffect(() => {
      TimeMe.initialize({
        currentPageName: "PostDetailPage", // current page
        idleTimeoutInSeconds: 15 // seconds
        });
    
        TimeMe.callWhenUserLeaves(() => {
        setShouldSendEvent(true);
        });
      
        TimeMe.callWhenUserReturns(() => {
        setShouldSendEvent(false);
        });
    
      }, []);*/

  return (
    <>
        <Topbar isProfile="true" setSelectedValue={setSelectedValue} style={{ 'margin-top': '-20px' }}  showRefreshIcon={false}/>
        <div className={classes.feed}>
            <div className={classes.feedWrapper}>
            <Link style={{textDecoration: 'none', color: COLORS.textColor}}><ArrowBackIcon onClick={() => history.goBack()}/></Link>
              <Post key={postObj._id} post={postObj} isDetail={true}/>
            </div>
        </div>
    </>
)
}

export default withStyles(styles)(Postdetail);
