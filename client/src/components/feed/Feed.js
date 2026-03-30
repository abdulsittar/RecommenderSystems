import React from 'react';
import {useState, useEffect} from 'react'
import Post from '../post/Post'
import Share from '../share/Share'
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UpdateUser } from "../../context/AuthActions";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './feedStyle';
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../loader/loader";
import LoadingBar from "react-top-loading-bar";
import { useMediaQuery } from 'react-responsive';
import {useRef} from 'react';
import {regSw, subscribe} from '../../helper.js';
import {io} from 'socket.io-client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { Slider, Box, Typography } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function Feed({username, classes, selectedValue, searchTerm, actionTriggered, setHasReadArticle, currentRound}) {
const [posts, setPosts] = useState([]);
const [hasMore, setHasMore] = useState(true);
const [index, setIndex] = useState(0);
const [isFiltered, setIsFiltered] = useState(false);
const [preFilter, setPreFilter] = useState(-1);
const [progress, setProgress] = useState(0);
const [preProfile, setPreProfile] = useState(" ");
const [viewedPosts, setViewedPosts] = useState([]);
const [shownPostIds, setShownPostIds] = useState([]); // Track shown post IDs for "View More Articles"
const shownPostIdsRef = useRef([]); // Ref for synchronous tracking of shown post IDs
const shownArticleIdsRef = useRef([]); // Track shown ARTICLE IDs to prevent duplicate articles
const { user: currentUser, dispatch } = useContext(AuthContext);
const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
const [socket, setSocket] = useState(null)
const [open, setOpen] = React.useState(false);
    const [nextDialogOpen, setNextDialogOpen] = useState(false);
    const [nextSelectedOption, setNextSelectedOption] = useState('option1');
    const [currentTopic, setCurrentTopic] = useState(null); // Track the current topic for filtering posts
//const [hasReadArticle, setHasReadArticle] = useState(false);

// Weekly survey modal state
const [weeklySurveyOpen, setWeeklySurveyOpen] = useState(false);
const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
const [sessionCount, setSessionCount] = useState(1);
const [weeklyData, setWeeklyData] = useState({
    topicAttitude: 50,
    oneSide_openminded: 5,
    oneSide_moderate: 5,
    oneSide_moral: 5,
    oneSide_family: 5,
    oneSide_friend: 5,
    oneSide_coworker: 5,
    otherSide_openminded: 5,
    otherSide_moderate: 5,
    otherSide_moral: 5,
    otherSide_family: 5,
    otherSide_friend: 5,
    otherSide_coworker: 5
});
 
let postCallCount = 0; 
let maxCalls = 5; 


const handleFeedAction = async (e) => {
    console.log("Feed received action from Topbar!");
    const token = localStorage.getItem('token');
    
    const lc = await axios.post("/posts/" + currentUser._id + "/createRefreshData", { version: user.pool, userId: user._id, headers: { 'auth-token': token }});
    fetchPosts(0); 
    
};

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    continueProcess(0)
    setPosts(prevPosts => prevPosts.slice(1));
  };
  
  const handleYes = async (e) => {
    setOpen(false);
    
    const firstPost = posts[0];
    
    setTimeout(() => {
        setPosts(prevPosts => prevPosts.slice(1));
      }, 1000);
    
    const token = localStorage.getItem('token');
        const newPost = {
          userId: user._id,
          desc: firstPost.desc,
          thumb: firstPost.thumb,
          pool:user.pool,
          headers: { 'auth-token': token },
        };
        try {
            const pst = await axios.post("/posts/" + user._id + "/create", newPost);
            socket.emit('sendMessage', pst);
            await axios.post("/posts/UserReadSpecialPost", {"postId": firstPost._id, "userId":user._id , headers: { 'auth-token': token }})
            continueProcess(10000)
            postCallCount++;
    } catch (err) {console.log(err);
    }
  };
  
  const continueProcess = (dlay) => {
    if (postCallCount < maxCalls) {
      // Call showPostsInOrder again after 60 seconds
      setTimeout(() => {
        showPostsInOrder();
        
  
        // Continue the process by checking the condition in handleYes
        if (postCallCount < maxCalls) {
          setTimeout(() => {
            //handleYes();
          }, 5000);  // Wait 20 seconds after showPostsInOrder for handleYes
        }
  
      }, dlay);  // 60000 milliseconds = 60 seconds
    } else {
      console.log("Process stopped after 5 calls.");
    }
  };

    const handleOpenNextDialog = () => {
        // PILOT STUDY: Topic selection is locked after first selection
        // MAIN STUDY: Uncomment below to allow topic changes
        // Map current topic back to option value to show correct selection in dialog
        /*
        const topicToOptionMapping = {
            'abortion': 'option1',
            'assisted death': 'option2',
            'climate action': 'option3',
            'gun control': 'option4',
            'military armament': 'option5',
            'nuclear power': 'option6',
            'social media regulation': 'option7'
        };
        const currentOption = topicToOptionMapping[currentTopic] || 'option1';
        setNextSelectedOption(currentOption);
        setNextDialogOpen(true);
        */
        // For pilot study, topic changing is disabled
        console.log('Topic changing is disabled for pilot study');
    }

    const handleNextDialogClose = (event, reason) => {
    if (reason === "backdropClick") {
        return; // prevent closing when clicking outside
    }
    setNextDialogOpen(false);
};

    const handleNextOptionChange = (e) => {
        setNextSelectedOption(e.target.value);
    }

    const handleNextConfirm = async () => {
            // PILOT STUDY: Only 3 topics available
            // MAIN STUDY: Uncomment all 7 topics below
            const topicMapping = {
                option1: 'abortion',                 // Abortion
                // option2: 'assisted death',        // Assisted Death (MAIN STUDY ONLY)
                // option3: 'climate action',        // Climate Action (MAIN STUDY ONLY)
                // option4: 'gun control',           // Gun Control (MAIN STUDY ONLY)
                option5: 'military armament',        // Military Armament
                // option6: 'nuclear power',         // Nuclear Power (MAIN STUDY ONLY)
                option7: 'social media regulation'   // Social Media Regulation
            };
            const topic = topicMapping[nextSelectedOption] || 'abortion';
            console.log('handleNextConfirm - Selected option:', nextSelectedOption, 'Mapped topic:', topic);
            
            // Check if this is first topic selection OR topic changed
            const isFirstTopic = !currentTopic;
            const topicChanged = currentTopic && currentTopic !== topic;
            
            setCurrentTopic(topic); // Store the selected topic for filtering
            setNextDialogOpen(false);
            
            // Clear shown post IDs and article IDs when topic changes
            shownArticleIdsRef.current = [];
            shownPostIdsRef.current = [];
            setShownPostIds([]);
            
            // Scroll to top of page when changing topic
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Check if user already has a survey for this topic
            try {
                const token = localStorage.getItem('token');
                const existingSurveyResponse = await axios.get(`/users/${user._id}/weeklyResponse/${topic}`, {
                    headers: { 'auth-token': token }
                });
                
                const hasSurveyForTopic = existingSurveyResponse.data && existingSurveyResponse.data.exists;
                console.log(`Survey exists for topic "${topic}":`, hasSurveyForTopic);
                
                // If topic changed and NO survey exists for this topic, show survey with default values
                if (topicChanged && !hasSurveyForTopic) {
                    console.log('Topic changed to', topic, '- no survey exists yet, showing weekly survey with default values');
                    
                    // Reset to default middle values
                    setWeeklyData({
                        topicAttitude: 50,
                        oneSide_openminded: 5,
                        oneSide_moderate: 5,
                        oneSide_moral: 5,
                        oneSide_family: 5,
                        oneSide_friend: 5,
                        oneSide_coworker: 5,
                        otherSide_openminded: 5,
                        otherSide_moderate: 5,
                        otherSide_moral: 5,
                        otherSide_family: 5,
                        otherSide_friend: 5,
                        otherSide_coworker: 5
                    });
                    
                    // Store topic for survey submission, but DON'T set showWeeklySurvey flag
                    localStorage.setItem('weeklySurveyReason', 'topicChange');
                    localStorage.setItem('pendingTopic', topic);
                    setWeeklySurveyOpen(true);
                    return; // Don't fetch posts yet - will fetch after survey
                }
                
                // If topic changed but survey already exists, just switch topics without survey
                if (topicChanged && hasSurveyForTopic) {
                    console.log('Topic changed to', topic, '- survey already exists, switching without survey');
                    await axios.put(`/users/${user._id}/updateTopic`, {
                        topic: topic
                    }, { headers: { 'auth-token': token } });
                    
                    // Fetch updated user data to get the stance score and overton window for THIS topic
                    const userResponse = await axios.get(`/users?userId=${user._id}`, { 
                        headers: { 'auth-token': token } 
                    });
                    
                    // Update the user in context with topic-specific data
                    if (userResponse.data) {
                        dispatch(UpdateUser(userResponse.data));
                        // console.log('User updated with topic-specific survey data:', {
                        //     stanceScore: userResponse.data.stanceScore,
                        //     overtonWindow: userResponse.data.overtonWindow,
                        //     currentTopic: userResponse.data.currentTopic,
                        //     controlGroup: userResponse.data.controlGroup
                        // });
                    }
                    
                    await axios.post(`/posts/${user._id}/createInitialData`, { topic, pool: user.pool, userId: user._id }, { headers: { 'auth-token': token } });
                    setIndex(0);
                    await fetchPostsWithTopic(selectedValue, 0, topic);
                    return;
                }
                
                // If this is first topic selection and NO survey exists, show survey with default values
                if (isFirstTopic && !hasSurveyForTopic) {
                    console.log('First topic selection - no survey exists yet, showing weekly survey with default values');
                    
                    // Reset to default middle values
                    setWeeklyData({
                        topicAttitude: 50,
                        oneSide_openminded: 5,
                        oneSide_moderate: 5,
                        oneSide_moral: 5,
                        oneSide_family: 5,
                        oneSide_friend: 5,
                        oneSide_coworker: 5,
                        otherSide_openminded: 5,
                        otherSide_moderate: 5,
                        otherSide_moral: 5,
                        otherSide_family: 5,
                        otherSide_friend: 5,
                        otherSide_coworker: 5
                    });
                    
                    // Store topic for survey submission, but DON'T set showWeeklySurvey flag
                    localStorage.setItem('pendingTopic', topic);
                    localStorage.setItem('weeklySurveyReason', 'firstTime');
                    setWeeklySurveyOpen(true);
                    return; // Don't fetch posts yet - will fetch after survey
                }
                
                // If first topic and survey exists, just load the topic
                if (isFirstTopic && hasSurveyForTopic) {
                    console.log('First topic selection - survey already exists, loading topic');
                    await axios.put(`/users/${user._id}/updateTopic`, {
                        topic: topic
                    }, { headers: { 'auth-token': token } });
                    
                    // Fetch updated user data to get the stance score and overton window for THIS topic
                    const userResponse = await axios.get(`/users?userId=${user._id}`, { 
                        headers: { 'auth-token': token } 
                    });
                    
                    // Update the user in context with topic-specific data
                    if (userResponse.data) {
                        dispatch(UpdateUser(userResponse.data));
                        // console.log('User updated with topic-specific survey data:', {
                        //     stanceScore: userResponse.data.stanceScore,
                        //     overtonWindow: userResponse.data.overtonWindow,
                        //     currentTopic: userResponse.data.currentTopic,
                        //     controlGroup: userResponse.data.controlGroup
                        // });
                    }
                    
                    await axios.post(`/posts/${user._id}/createInitialData`, { topic, pool: user.pool, userId: user._id }, { headers: { 'auth-token': token } });
                    setIndex(0);
                    await fetchPostsWithTopic(selectedValue, 0, topic);
                    return;
                }
            } catch (err) {
                console.error('Error checking existing survey:', err);
                // If check fails, proceed with normal flow
            }
            
            try {
                const token = localStorage.getItem('token');
                // Update user's current topic
                await axios.put(`/users/${user._id}/updateTopic`, {
                    topic: topic
                }, { headers: { 'auth-token': token } });
                
                // Call server to create initial training data for this user/topic
                await axios.post(`/posts/${user._id}/createInitialData`, { topic, pool: user.pool, userId: user._id }, { headers: { 'auth-token': token } });
                // After creation, reset index and fetch posts (page 0) with the new topic
                setIndex(0);
                await fetchPostsWithTopic(selectedValue, 0, topic); // Pass topic directly instead of relying on state
            } catch (err) {
                console.error('Error creating initial data:', err);
                // still attempt to fetch posts so UI can recover
                await fetchPostsWithTopic(selectedValue, 0, topic); // Pass topic directly
            }
    }

    // Get topic-specific side labels for all 7 topics
    const getTopicSides = (topic) => {
        const topicLower = (topic || '').toLowerCase();
        if (topicLower.includes('abortion')) {
            return { oneSide: 'pro-choice advocates', otherSide: 'pro-life advocates' };
        } else if (topicLower.includes('gun')) {
            return { oneSide: 'gun freedom advocates', otherSide: 'gun control advocates' };
        } else if (topicLower.includes('assisted death') || topicLower.includes('euthanasia')) {
            return { oneSide: 'pro assisted death advocates', otherSide: 'anti assisted death advocates' };
        } else if (topicLower.includes('nuclear')) {
            return { oneSide: 'pro nuclear power advocates', otherSide: 'anti nuclear power advocates' };
        } else if (topicLower.includes('social media') || topicLower.includes('regulation')) {
            return { oneSide: 'pro regulation advocates', otherSide: 'anti regulation advocates' };
        } else if (topicLower.includes('military') || topicLower.includes('armament')) {
            return { oneSide: 'pro armament advocates', otherSide: 'anti armament advocates' };
        } else if (topicLower.includes('climate')) {
            return { oneSide: 'high concern advocates', otherSide: 'low concern advocates' };
        } else {
            return { oneSide: 'one side advocates', otherSide: 'other side advocates' };
        }
    };

    // Weekly survey handlers
    const handleWeeklySurveySliderChange = (field, value) => {
        setWeeklyData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleWeeklySurveySubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const weeklySurveyReason = localStorage.getItem('weeklySurveyReason');
            const pendingTopic = localStorage.getItem('pendingTopic') || currentTopic;
            
            // Clear flags FIRST to prevent re-triggering
            localStorage.removeItem('weeklySurveyReason');
            localStorage.removeItem('pendingTopic');
            localStorage.removeItem('showWeeklySurvey');
            
            // Calculate current week number
            const now = new Date();
            const weekNumber = Math.floor((now.getTime() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));

            // Calculate Overton window based on the 13 survey questions with proper weighting
            // Weight: 33.33% for Q1, 33.33% for Q2-Q7, 33.33% for Q8-Q13
            // Q8-Q13 have NEGATIVE weight (they represent the opposite side)
            
            // Q1: Normalize from [1-100] to [-1, +1] scale
            // Value 1 → -1, Value 50.5 → 0, Value 100 → +1
            const q1_normalized = (weeklyData.topicAttitude - 50.5) / 49.5;
            const weight_q1 = q1_normalized * 0.3333;
            
            // Q2-Q7: Average and normalize from [1-10] to [-1, +1] scale
            // These measure alignment WITH your side (higher = more aligned)
            const q2_7_values = [
                weeklyData.oneSide_openminded,
                weeklyData.oneSide_moderate,
                weeklyData.oneSide_moral,
                weeklyData.oneSide_family,
                weeklyData.oneSide_friend,
                weeklyData.oneSide_coworker
            ];
            const q2_7_avg = q2_7_values.reduce((a, b) => a + b, 0) / q2_7_values.length;
            const q2_7_normalized = (q2_7_avg - 5.5) / 4.5;  // Value 1→-1, 5.5→0, 10→+1
            const weight_q2_7 = q2_7_normalized * 0.3333;
            
            // Q8-Q13: Average and normalize from [1-10] to [-1, +1] scale
            // These measure alignment with OTHER side (higher = more they're aligned with other side)
            // NEGATIVE weight: if other side rates high, your stance moves NEGATIVE direction
            const q8_13_values = [
                weeklyData.otherSide_openminded,
                weeklyData.otherSide_moderate,
                weeklyData.otherSide_moral,
                weeklyData.otherSide_family,
                weeklyData.otherSide_friend,
                weeklyData.otherSide_coworker
            ];
            const q8_13_avg = q8_13_values.reduce((a, b) => a + b, 0) / q8_13_values.length;
            const q8_13_normalized = (q8_13_avg - 5.5) / 4.5;  // Value 1→-1, 5.5→0, 10→+1
            const weight_q8_13 = -q8_13_normalized * 0.3333;  // NEGATIVE: high otherSide values reduce stance
            
            // Calculate final stance score: now directly in [-1, +1] range
            // Convert to [0-100] scale for backend compatibility
            const stanceScore_normalized = weight_q1 + weight_q2_7 + weight_q8_13;  // [-1, +1]
            const stanceScore = (stanceScore_normalized + 1) * 50;  // Convert to [0, 100]
            
            // console.log('Overton Window Calculation:', {
            //     topicAttitude: weeklyData.topicAttitude,
            //     q1_normalized,
            //     weight_q1,
            //     q2_7_avg,
            //     q2_7_normalized,
            //     weight_q2_7,
            //     q8_13_avg,
            //     q8_13_normalized,
            //     weight_q8_13_negative: weight_q8_13,
            //     stanceScore_normalized,
            //     finalStanceScore: stanceScore
            // });

            // Submit weekly survey with topic and calculated stance score
            const response = await axios.post('/users/weeklyResponse', {
                ...weeklyData,
                userId: user._id,
                topic: pendingTopic,
                weekNumber: weekNumber,
                calculatedStanceScore: stanceScore  // Send calculated score to backend
            }, { headers: { 'auth-token': token } });

            if (response.status === 200) {
                console.log('Weekly survey submitted successfully', response.data);
                
                // Update user's current topic and lastTopicChangeDate
                await axios.put(`/users/${user._id}/updateTopic`, {
                    topic: pendingTopic
                }, { headers: { 'auth-token': token } });
                
                // Fetch updated user data to get the new stance score and overton window
                const userResponse = await axios.get(`/users?userId=${user._id}`, { 
                    headers: { 'auth-token': token } 
                });
                
                // Update the user in context with new control group data
                if (userResponse.data) {
                    dispatch(UpdateUser(userResponse.data));
                    // console.log('User updated with new survey data:', {
                    //     stanceScore: userResponse.data.stanceScore,
                    //     overtonWindow: userResponse.data.overtonWindow,
                    //     currentTopic: userResponse.data.currentTopic,
                    //     controlGroup: userResponse.data.controlGroup
                    // });
                }
                
                setWeeklySurveyOpen(false);
                
                // After survey submission, create initial data and fetch posts
                // (for both first time and topic change scenarios)
                try {
                    await axios.post(`/posts/${user._id}/createInitialData`, { 
                        topic: pendingTopic, 
                        pool: user.pool, 
                        userId: user._id 
                    }, { headers: { 'auth-token': token } });
                    setIndex(0);
                    await fetchPostsWithTopic(selectedValue, 0, pendingTopic);
                } catch (err) {
                    console.error('Error creating initial data after survey:', err);
                    await fetchPostsWithTopic(selectedValue, 0, pendingTopic);
                }
            }
        } catch (error) {
            console.error('Error submitting weekly survey:', error);
            alert('There was an error submitting your survey. Please try again.');
        }
    };
  

const [windowSize, setWindowSize] = useState(getWindowSize());

//useEffect(() => {
    //console.log("setSocket");
    //setSocket(io('wss://cleopatra.ijs.si/chat', {
     //   transports: [ 'polling'],
    //    withCredentials: true
    //  }));
      
    
//}, [])

useEffect(() => { 
    if (actionTriggered) {
        handleFeedAction();
    }
}, [actionTriggered]);

useEffect(() => {
    console.log('Posts updated: ', posts);
}, [posts]);

// Initialize current topic from user's saved topic
useEffect(() => {
    if (user && currentUser.currentTopic && !currentTopic) {
        console.log('Loading user current topic:', currentUser.currentTopic);
        setCurrentTopic(currentUser.currentTopic);
    }
}, [currentUser]);

// Check for recurring session on mount (after auto-login)
useEffect(() => {
    console.log('🔄 Feed component mounted');
    
    if (currentUser?._id) {
        const recurringSessionKey = `isRecurringSession_${currentUser._id}`;
        const isRecurringSession = localStorage.getItem(recurringSessionKey);
        const sessionCountKey = `sessionCount_${currentUser._id}`;
        const storedSessionCount = parseInt(localStorage.getItem(sessionCountKey) || '1');
        
        console.log(`Session info - isRecurring: ${isRecurringSession}, count: ${storedSessionCount}`);
        
        if (isRecurringSession === 'true') {
            console.log(`🔄 Returning user detected - Welcome to Session ${storedSessionCount}!`);
            setSessionCount(storedSessionCount);
            setWelcomeDialogOpen(true);
            
            // Clear the flag after showing
            localStorage.removeItem(recurringSessionKey);
        }
    }
}, [currentUser]); // Run when currentUser changes (after login)

// Check if user needs to select a topic (first time) or show welcome message for recurring session
useEffect(() => {
    const showWeeklySurvey = localStorage.getItem('showWeeklySurvey');
    const weeklySurveyReason = localStorage.getItem('weeklySurveyReason');
    // Use user-specific keys
    const recurringSessionKey = currentUser?._id ? `isRecurringSession_${currentUser._id}` : 'isRecurringSession';
    const isRecurringSession = localStorage.getItem(recurringSessionKey);
    const sessionCountKey = currentUser?._id ? `sessionCount_${currentUser._id}` : 'sessionCount';
    const storedSessionCount = localStorage.getItem(sessionCountKey);
    
    console.log('Feed useEffect - checking flags:', {
        showWeeklySurvey,
        weeklySurveyReason,
        isRecurringSession,
        storedSessionCount,
        weeklySurveyOpen
    });
    
    // Don't do anything if survey is already open
    if (weeklySurveyOpen) {
        console.log('Survey already open, skipping useEffect checks');
        return;
    }
    
    // Priority 1: If user doesn't have a current topic, show topic selection dialog FIRST
    // Only show if both currentUser and local state don't have a topic
    if (user && !currentUser.currentTopic && !currentTopic) {
        console.log('User has no currentTopic set - showing topic selection dialog');
        console.log('currentUser.currentTopic:', currentUser.currentTopic, 'currentTopic state:', currentTopic);
        setTimeout(() => {
            setNextDialogOpen(true);
        }, 500);
    } else if (currentUser.currentTopic || currentTopic) {
        console.log('✅ User has topic:', currentUser.currentTopic || currentTopic);
    }
    // Priority 2: If user has a topic AND flag is set, show weekly survey
    else if (showWeeklySurvey === 'true' && (currentUser.currentTopic || currentTopic)) {
        console.log('Weekly survey should be shown. Reason:', weeklySurveyReason);
        // Show weekly survey modal after a brief delay
        setTimeout(() => {
            setWeeklySurveyOpen(true);
        }, 1000);
        // Clear the flag so it doesn't show again on refresh
        localStorage.removeItem('showWeeklySurvey');
    }
}, [currentUser, currentTopic, weeklySurveyOpen]);

useEffect(() => {

    socket?.emit('addUser', user?.id)
        console.log("active users ")
        socket?.on('getUsers', users => { 
            console.log("active users ", users)
        })

    socket?.on('getMessage', res => {
        console.log('active data: >>', res.data );
        if(res.data.pool == user.pool){
            const arr = [res.data]
            setPosts([])
            if (Array.isArray(res.data)) {
                setPosts(res.data)
            }
            //setPosts((prevItems) => [...arr, ...prevItems]);
            console.log('posts data: >>', posts );
        }
        
        //fetchPosts(selectedValue); 
    });
    
}, [socket]);

const showPostsInOrder = async () => {
    const token = localStorage.getItem('token');
    console.log("showPostsInOrder");
    const res = await axios.get("/posts/" + currentUser._id + "/getSpecialPosts", {headers: { 'auth-token': token }})
    console.log(res.data);
    
    if(res.data['no']){
        const arr = [{"_id": res.data["_id"], "desc":res.data["desc"], "pool":res.data["pool"] , "userId": "66f590ae38f16e2cea8d0646", "thumb":"https://fastly.picsum.photos/id/451/200/300.jpg?blur=5&hmac=Cs_EydLmPTWdSMrzBl8vXIG9b3CaH9iP_yVdDFiXUhU", "likes":[],
        "dislikes":[], "comments":[], "reposts":[], "rank":1000}]
        //setPosts((prevItems) => [...arr, ...prevItems]);
        setPosts(arr);
        console.log('posts data: >>', posts );

        //postCallCount++;
        setTimeout(handleClickOpen, 5000);
}

  };


const increment  = async (pv, iv) => {
    console.log("increatem");
    console.log(pv);
    console.log(iv);
    setIndex(pv+iv);
    console.log(index);
};

    /*async function registerAndSubscribe () {
    try {
        const serviceWorkerReg = await regSw ();
        await subscribe (serviceWorkerReg);
    } catch (error) {
        console.log (error);
    }
}*/

const {user} = useContext(AuthContext);
const [followed, setFollowed] = useState([]
    //currentUser.followings.includes(user?.id)
    );

    if(preFilter == -1){
    console.log(preFilter);
    setPreFilter(selectedValue);

    } else if(preFilter !== selectedValue){
    setIndex(0);
    setPosts([]);
    setPreFilter(selectedValue);

    }

const chek = username ?  true : false;
if(chek == true) {
    console.log(preProfile);
    console.log("User name1");
    console.log(username);
    const ii = (preProfile === username) ? true : false;
    console.log(ii);
if (preProfile === " ") {
    setPreProfile(username);
    console.log("User name2");
    console.log(username);
    console.log(preProfile);
    console.log(user.username);
} else if(preProfile !== username) {
    console.log("a NEW User name");
    console.log(username);
    setIndex(0);
    setPosts([]);
    setPreProfile(username);
}
}

const filterLoadedPosts = async () => {
    console.log("filterLoadedPosts");
    if (searchTerm === '') {
        setPosts(posts);
    } else {
        const filteredData = posts.filter((post) => {
        return post.desc.toLowerCase().includes(searchTerm.toLowerCase())
        });
        setPosts(filteredData);
    }
    
}

const fetchPostsWithTopic = async (selectedValue, pageArg, topicParam) => {
    setProgress(30);
    // Use user-specific session count key
    const sessionCountKey = currentUser?._id ? `sessionCount_${currentUser._id}` : 'sessionCount';
    const currentSessionNum = localStorage.getItem(sessionCountKey) || '1';
    console.log(`📊 [Session ${currentSessionNum}] fetchPostsWithTopic with topic:`, topicParam);
    const chek = username ?  true : false;
if(chek == true) {
    console.log(preProfile);
    console.log("User name1");
    console.log(username);
    const ii = (preProfile === username) ? true : false;
    console.log(ii);
if (preProfile === " ") {
    setPreProfile(username);
    console.log("User name2");
    console.log(username);
    console.log(preProfile);
    console.log(user.username);
} else if(preProfile !== username) {
    console.log("a NEW User name");
    console.log(username);
    setIndex(0);
    setPosts([]);
    setPreProfile(username);
}
}

    var whPosts = "/posts/timelinePag/";

    if(selectedValue == 0){
    var whPosts = "/posts/timelinePag/";
    }
    else if (selectedValue == 1){
        whPosts = "/posts/onlyFollowersPag/"
    }
    else if (selectedValue == 2){
        whPosts = "/posts/onlyFollowingsPag/"
    }
    console.log(preFilter);
    console.log(whPosts);
    const token = localStorage.getItem('token');
    const page = (typeof pageArg !== 'undefined' && pageArg !== null) ? pageArg : index;
    
    // Build URL with topic parameter if topicParam is set
    let url;
    if (username) {
        url = `/posts/profile/${username}?page=${page}`;
    } else {
        url = `${whPosts}${user._id}?page=${page}`;
        // Add topic parameter for timeline endpoints (when topicParam is set)
        console.log('URL building - topicParam:', topicParam, 'selectedValue:', selectedValue, 'condition met:', (topicParam && (selectedValue === 0)));
        if (topicParam && (selectedValue === 0)) { // Only for timeline feed (selectedValue === 0)
            url += `&topic=${encodeURIComponent(topicParam)}`;
            console.log('Added topic to URL:', url);
        }
    }
    
    console.log('fetchPostsWithTopic - topicParam:', topicParam, 'selectedValue:', selectedValue, 'url:', url);
    
    const res = await axios.get(url, {headers: { 'auth-token': token, 'userId': user._id }});
    console.log(res.data);
    console.log("fetch posts");
    if(res.data.length){
    if(res.data.length > 0){
        setPosts([])
        if (Array.isArray(res.data)) {
            setPosts(res.data)
            
            // IMPORTANT: Track these initial ARTICLES (not just posts) so they don't reappear later
            // Convert to strings for consistent comparison
            const articleIds = res.data.filter(p => p.articleId).map(p => String(p.articleId));
            shownArticleIdsRef.current = [...new Set([...shownArticleIdsRef.current, ...articleIds])];
            console.log('Initial posts loaded and tracked:', articleIds.length, 'unique articles. Total tracked:', shownArticleIdsRef.current.length);
            console.log('Tracked article IDs:', shownArticleIdsRef.current);
        }
        
        // If currentTopic is not set and we got posts, infer the topic from the first post
        if (!currentTopic && res.data.length > 0 && res.data[0].content) {
            console.log('Inferring topic from first post:', res.data[0].content);
            setCurrentTopic(res.data[0].content);
        }
        
        res.data.length%20 > 0 ? setHasMore(false) : setHasMore(true);
        increment(index, 0);
        setProgress(100);
    } else {
        setHasMore(false);
        setProgress(100);
    }

    console.log(whPosts);
}
};

const fetchPosts = async (selectedValue, pageArg) => {
    console.log('fetchPosts called with currentTopic:', currentTopic, 'selectedValue:', selectedValue);
    return fetchPostsWithTopic(selectedValue, pageArg, currentTopic);
};

function updateViewdPosts( post) {
    /*const oldViewed = [...viewedPosts, post];
    setViewedPosts(oldViewed);
    console.log("array  ", viewedPosts);
    console.log("post id  ", post);
    console.log("viewed length ", viewedPosts.length);
    if(viewedPosts.length == 10){
        axios.put("/users/" + currentUser._id + "/viewed", { postId: post });
        setViewedPosts([]);
    }*/
    }

const fetchMoreData = async () => {
    setProgress(30);
    if(searchTerm? searchTerm.length !== 0 : false){
        console.log("searchTerm");
        console.log(searchTerm.length);
        setProgress(100);
        return
    }

    if(index == 0){
        setProgress(100);
        return
    }
    //console.log("fetchpost")
    
    console.log("fetch more  posts");
    console.log(selectedValue);
    var whPosts = "/posts/timelinePag/";

    if(selectedValue == 0){
        whPosts = "/posts/timelinePag/"
    }
    else if (selectedValue == 1){
        whPosts = "/posts/onlyFollowersPag/"
    }
    else if (selectedValue == 2){
        whPosts = "/posts/onlyFollowingsPag/"
    }

    const token = localStorage.getItem('token');
    
    // Build URL with topic parameter if currentTopic is set
    let url;
    if (username) {
        url = `/posts/profile/${username}?page=${index}`;
    } else {
        url = `${whPosts}${user._id}?page=${index}`;
        // Add topic parameter for timeline endpoints (when currentTopic is set)
        console.log('fetchMoreData URL building - currentTopic:', currentTopic, 'selectedValue:', selectedValue, 'condition met:', (currentTopic && (selectedValue === 0)));
        if (currentTopic && (selectedValue === 0)) { // Only for timeline feed (selectedValue === 0)
            url += `&topic=${encodeURIComponent(currentTopic)}`;
            console.log('fetchMoreData - Added topic to URL:', url);
        }
    }
    
    const res = await axios.get(url, {headers: { 'auth-token': token }});
    //console.log(res.data);
    
    if(res.data.length > 0){
        //setPosts((prevItems) => [...prevItems, ...res.data
            //.sort((p1,p2) => {return new Date(p2.createdAt) - new Date(p1.createdAt);})
        //]);
        setPosts([])
        if (Array.isArray(res.data)) {
                setPosts(res.data)
            }
         res.data.length%20 > 0 ? setHasMore(false) : setHasMore(true);
        increment(index, 0);
        setProgress(100);
    }else {
        setHasMore(false);
        setProgress(100);
        //setPosts([]);
        //setIndex((index) => 0);
        //increment(index, -index);
    }
};

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
    };

useEffect(() => {
    //registerAndSubscribe();
    console.log("use effects!");
    //showPostsInOrder();
    if (selectedValue !=10){
    ///// Remove this breakpoint during the casestudy
        //filterLoadedPosts()
        if(searchTerm? searchTerm.length !== 0 : false){
            console.log("searchTerm");
            console.log(searchTerm.length);
            filterLoadedPosts()
        } else {
            //filterLoadedPosts()
            fetchPosts(selectedValue);
        }
    }

    function handleWindowResize() {
        setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
        window.removeEventListener('resize', handleWindowResize);
    };

}, [username, user._id, selectedValue, searchTerm])

const refreshed = async (selectedValue) => {
    console.log("refreshed");
    setPosts([]);
    const chek = username ?  true : false;
if(chek == true) {
    console.log(preProfile);
    console.log("User name1");
    console.log(username);
    const ii = (preProfile === username) ? true : false;
    console.log(ii);
    
if (preProfile === " ") {
    setPreProfile(username);
    console.log("User name2");
    console.log(username);
    console.log(preProfile);
    console.log(user.username);
    
} else if(preProfile !== username) {
    console.log("a NEW User name");
    console.log(username);
    setIndex(0);
    setPosts([]);
    setPreProfile(username);
}
}

    var whPosts = "/posts/timelinePag/";

    if(selectedValue == 0){
    var whPosts = "/posts/timelinePag/";
    }
    else if (selectedValue == 1){
        whPosts = "/posts/onlyFollowersPag/"
    }
    else if (selectedValue == 2){
        whPosts = "/posts/onlyFollowingsPag/"
    }
    console.log(preFilter);
    console.log(whPosts);
    const token = localStorage.getItem('token');
    
    // Build URL with topic parameter if currentTopic is set
    let url;
    if (username) {
        url = `/posts/profile/${username}?page=${0}`;
    } else {
        url = `${whPosts}${user._id}?page=${0}`;
        // Add topic parameter for timeline endpoints (when currentTopic is set)
        console.log('refreshed URL building - currentTopic:', currentTopic, 'selectedValue:', selectedValue, 'condition met:', (currentTopic && (selectedValue === 0)));
        if (currentTopic && (selectedValue === 0)) { // Only for timeline feed (selectedValue === 0)
            url += `&topic=${encodeURIComponent(currentTopic)}`;
            console.log('refreshed - Added topic to URL:', url);
        }
    }
    
    const res = await axios.get(url, {headers: { 'auth-token': token }});
    console.log(res.data);
    console.log("fetch posts");
    if(res.data.length){
    if(res.data.length > 0){
        //setPosts((prevItems) => [...prevItems, ...res.data
            //.sort((p1,p2) => {return new Date(p2.createdAt) - new Date(p1.createdAt);})
        //]);
        setPosts([])
        if (Array.isArray(res.data)) {
                setPosts(res.data)
            }
        res.data.length%20 > 0 ? setHasMore(false) : setHasMore(true);
        //setIndex((index) => index + 1);
        increment(0, 0);
    } else {
        setHasMore(false)
        //setPosts([]);
        //setIndex((index) => 0);
        //increment(index, -index);
    }

    //setPreFilter(whPosts);
    console.log(whPosts);
}}

    // Handler to get more posts on the same topic - shows NEW articles, excluding already shown ones
    const handleGetMorePosts = async () => {
        if (currentTopic) {
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Collect ALL article IDs we've shown so far (this prevents duplicate articles)
            // IMPORTANT: Track by articleId, not postId, since multiple posts can have same article
            const currentArticleIds = posts
                .filter(p => p.articleId) // Only posts with articles
                .map(p => String(p.articleId));
            const allExcludedArticleIds = [...new Set([...shownArticleIdsRef.current, ...currentArticleIds])];
            
            // Update ref synchronously
            shownArticleIdsRef.current = allExcludedArticleIds;
            
            console.log('View More clicked - Excluding:', allExcludedArticleIds.length, 'article IDs');
            console.log('Current articles on screen:', currentArticleIds);
            console.log('All excluded article IDs:', allExcludedArticleIds);
            // console.log('User control group:', currentUser.controlGroup);
            // console.log('User Overton window:', currentUser.overtonWindow);
            
            // Fetch new posts excluding already shown articles
            // IMPORTANT: Pass control group info to ensure edge/center filtering
            await fetchNewPostsExcluding(selectedValue, currentTopic, allExcludedArticleIds);
        }
    };
    
    // Fetch new posts excluding already shown ones
    const fetchNewPostsExcluding = async (selectedValue, topicParam, excludeArticleIds) => {
        setProgress(30);
        console.log("fetchNewPostsExcluding - topic:", topicParam, "excluding article count:", excludeArticleIds.length);
        // console.log("Control group:", currentUser.controlGroup, "Overton window:", currentUser.overtonWindow);
        
        var whPosts = "/posts/timelinePag/";
        if(selectedValue == 0){
            whPosts = "/posts/timelinePag/";
        } else if (selectedValue == 1){
            whPosts = "/posts/onlyFollowersPag/"
        } else if (selectedValue == 2){
            whPosts = "/posts/onlyFollowingsPag/"
        }
        
        const token = localStorage.getItem('token');
        
        // Build URL with topic, excludeArticles, and control group parameters
        let url = `${whPosts}${user._id}?page=0`; // Always page 0, but with exclusions
        if (topicParam) {
            url += `&topic=${encodeURIComponent(topicParam)}`;
        }
        if (excludeArticleIds && excludeArticleIds.length > 0) {
            // Send exclude ARTICLE IDs as comma-separated string
            url += `&excludeArticles=${excludeArticleIds.join(',')}`;
        }
        // IMPORTANT: Add control group info to ensure backend applies edge/center filtering
        if (currentUser.controlGroup) {
            url += `&controlGroup=${encodeURIComponent(currentUser.controlGroup)}`;
        }
        if (currentUser.overtonWindow) {
            url += `&overtonMin=${currentUser.overtonWindow.min}&overtonMax=${currentUser.overtonWindow.max}`;
        }
        
        console.log('fetchNewPostsExcluding - Fetching with URL:', url);
        
        try {
            const res = await axios.get(url, {headers: { 'auth-token': token, 'userId': user._id }});
            console.log('fetchNewPostsExcluding - Received posts:', res.data.length);
            
            // Log received article IDs for debugging
            const receivedArticleIds = res.data.filter(p => p.articleId).map(p => String(p.articleId));
            console.log('Received article IDs:', receivedArticleIds);
            console.log('Excluding these article IDs:', excludeArticleIds);
            
            if(res.data.length > 0){
                // Filter out any ARTICLES we've already seen AND deduplicate within this batch
                // CRITICAL: Filter by articleId, not post._id, to prevent duplicate articles
                const seenInBatch = new Set(excludeArticleIds); // Start with excluded IDs
                const newPosts = res.data.filter(post => {
                    if (!post.articleId) return true; // Keep posts without articles
                    const articleIdStr = String(post.articleId);
                    
                    // Check if already seen (in previous batches OR earlier in this batch)
                    if (seenInBatch.has(articleIdStr)) {
                        console.log('⚠️ Filtering out duplicate article:', articleIdStr, '(post ID:', post._id, ')');
                        return false;
                    }
                    
                    // Mark this article as seen for this batch
                    seenInBatch.add(articleIdStr);
                    return true;
                });
                console.log('fetchNewPostsExcluding - After client-side filtering:', newPosts.length, 'unique posts');
                
                if (newPosts.length > 0) {
                    // Log the new article IDs we're about to show (convert to strings)
                    const newArticleIds = newPosts.filter(p => p.articleId).map(p => String(p.articleId));
                    console.log('Displaying new articles:', newArticleIds);
                    
                    // Add these new article IDs to the ref immediately (synchronous)
                    const updatedExcluded = [...new Set([...shownArticleIdsRef.current, ...newArticleIds])];
                    shownArticleIdsRef.current = updatedExcluded;
                    
                    console.log('Total excluded articles after update:', shownArticleIdsRef.current.length);
                    
                    setPosts(newPosts);
                } else {
                    // All returned posts were duplicates
                    console.warn('⚠️ All returned posts were duplicate articles.');
                    alert('No more new articles available for this topic. Showing the first articles again.');
                    // Reset and start over
                    shownArticleIdsRef.current = [];
                    shownPostIdsRef.current = [];
                    setShownPostIds([]);
                    await fetchPostsWithTopic(selectedValue, 0, topicParam);
                }
            } else {
                // No posts returned at all
                console.warn('⚠️ No posts returned from server. Cycling back to start.');
                alert('You\'ve seen all articles on this topic! Showing them again from the start.');
                shownArticleIdsRef.current = [];
                shownPostIdsRef.current = [];
                setShownPostIds([]);
                await fetchPostsWithTopic(selectedValue, 0, topicParam);
            }
        } catch (error) {
            console.error('❌ Error fetching new posts:', error);
            alert('Error loading more articles. Please try again.');
        }
        
        setProgress(100);
    };

return (
    <div className={classes.feed}>
    <LoadingBar   color="#f11946"   progress={progress}   onLoaderFinished={() => setProgress(0)} />
        
        {/* Top Navigation Buttons */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: 20, marginTop: 10}}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGetMorePosts}
                disabled={!currentTopic}
            >
                View More Articles
            </Button>
            {/* PILOT STUDY: Topic changing disabled - button hidden */}
            {/* MAIN STUDY: Uncomment below to allow topic changes */}
            {/* <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleOpenNextDialog}
            >
                Change Topic
            </Button> */}
        </div>
        
        <InfiniteScroll dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<Loader />}>
        <div className={classes.feedWrapper} style={{"width": (!isMobileDevice && !isTabletDevice) && (windowSize.innerWidth-10)+"px"}}>
            {( !username || username === user.username) }
            {(() => {
                // Sort posts on the current page based on control group algorithm
                if (!Array.isArray(posts) || posts.length === 0) return null;
                
                // Helper function to check if user is centrist
                const isCentrist = (stance) => Math.abs(stance) < 0.2;
                
                // Create a sorted copy of posts
                let sortedPosts = [...posts];
                
                // Only sort if user has control group assigned and perspective scores exist
                if (currentUser?.controlGroup && currentUser?.overtonWindow) {
                    const windowMin = currentUser.overtonWindow.min;
                    const windowMax = currentUser.overtonWindow.max;
                    const windowCenter = (windowMin + windowMax) / 2;
                    const userStance = currentUser.stanceScore || 0;
                    
                    if (currentUser.controlGroup === 'control') {
                        // Control group: Sort by closeness to user's stance
                        sortedPosts.sort((a, b) => {
                            if (!a.perspectiveScore || !b.perspectiveScore) return 0;
                            // Convert perspective scores from [-1, 1] to [0, 100]
                            const scoreA = (a.perspectiveScore + 1) * 50;
                            const scoreB = (b.perspectiveScore + 1) * 50;
                            const userStance_0_100 = (userStance + 1) * 50;
                            
                            const distanceA = Math.abs(scoreA - userStance_0_100);
                            const distanceB = Math.abs(scoreB - userStance_0_100);
                            return distanceA - distanceB;
                        });
                    } else if (currentUser.controlGroup === 'edge') {
                        // Edge group: Sort by edge proximity (outside window first, then by distance from edges)
                        const userIsCentrist = isCentrist(userStance);
                        
                        sortedPosts.sort((a, b) => {
                            if (!a.perspectiveScore || !b.perspectiveScore) return 0;
                            const scoreA = (a.perspectiveScore + 1) * 50;
                            const scoreB = (b.perspectiveScore + 1) * 50;
                            
                            if (userIsCentrist) {
                                // Centrists: prefer articles outside window, closest to edges
                                const isAInWindow = scoreA >= windowMin && scoreA <= windowMax;
                                const isBInWindow = scoreB >= windowMin && scoreB <= windowMax;
                                
                                const distToEdgeA = Math.min(
                                    Math.abs(scoreA - windowMin),
                                    Math.abs(scoreA - windowMax)
                                );
                                const distToEdgeB = Math.min(
                                    Math.abs(scoreB - windowMin),
                                    Math.abs(scoreB - windowMax)
                                );
                                
                                if (!isAInWindow && !isBInWindow) {
                                    return distToEdgeA - distToEdgeB;
                                }
                                if (isAInWindow && isBInWindow) {
                                    return 0; // Both inside, keep original order
                                }
                                return isAInWindow ? 1 : -1; // Outside first
                            } else {
                                // Extremists: prefer opposite edge
                                const oppositeEdge = userStance > 0 ? windowMin : windowMax;
                                const distA = Math.abs(scoreA - oppositeEdge);
                                const distB = Math.abs(scoreB - oppositeEdge);
                                return distA - distB;
                            }
                        });
                    } else if (currentUser.controlGroup === 'center') {
                        // Center group: Sort by distance from window center
                        sortedPosts.sort((a, b) => {
                            if (!a.perspectiveScore || !b.perspectiveScore) return 0;
                            const scoreA = (a.perspectiveScore + 1) * 50;
                            const scoreB = (b.perspectiveScore + 1) * 50;
                            
                            const distanceA = Math.abs(scoreA - windowCenter);
                            const distanceB = Math.abs(scoreB - windowCenter);
                            return distanceA - distanceB;
                        });
                    }
                }
                
                return sortedPosts.map((p) => (
  <Post
    onScrolling={updateViewdPosts}
    key={p._id}
    post={p}
    isDetail={false}
    setHasReadArticle={setHasReadArticle}
    currentRound={currentRound}
  />
));
            })()}

        </div>
        </InfiniteScroll>
        
        {/* Bottom Navigation Buttons */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 20}}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGetMorePosts}
                disabled={!currentTopic}
            >
                View More Articles
            </Button>
{/* PILOT STUDY: Topic changing disabled - button hidden */}
                {/* MAIN STUDY: Uncomment below to allow topic changes */}
                {/* <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleOpenNextDialog}
            >
                Change Topic
            </Button> */}
        </div>
                {/* PILOT STUDY: Only 3 topics available, dialog shown only on first login */}
                <Dialog open={nextDialogOpen} onClose={handleNextDialogClose} aria-labelledby="next-dialog-title" disableEscapeKeyDown>
                    <DialogTitle id="next-dialog-title">Select Topic</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose a topic to see posts about that subject. You will continue with this topic for all sessions.
                        </DialogContentText>
                        <FormControl component="fieldset" style={{marginTop: 8}}>
                            <FormLabel component="legend">Topics</FormLabel>
                            <RadioGroup value={nextSelectedOption} onChange={handleNextOptionChange}>
                                {/* PILOT STUDY: Only 3 topics */}
                                <FormControlLabel value="option1" control={<Radio />} label="Abortion" />
                                <FormControlLabel value="option5" control={<Radio />} label="Military Armament" />
                                <FormControlLabel value="option7" control={<Radio />} label="Social Media Regulation" />
                                {/* MAIN STUDY: Uncomment all topics below */}
                                {/* <FormControlLabel value="option2" control={<Radio />} label="Assisted Death" />
                                <FormControlLabel value="option3" control={<Radio />} label="Climate Action" />
                                <FormControlLabel value="option4" control={<Radio />} label="Gun Control" />
                                <FormControlLabel value="option6" control={<Radio />} label="Nuclear Power" /> */}
                            </RadioGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNextDialogClose}>Cancel</Button>
                        <Button onClick={handleNextConfirm} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>

        {/* Welcome Back Dialog for Recurring Sessions */}
        <Dialog 
            open={welcomeDialogOpen} 
            onClose={() => setWelcomeDialogOpen(false)} 
            aria-labelledby="welcome-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="welcome-dialog-title">Welcome Back!</DialogTitle>
            <DialogContent>
                <Typography variant="body1" style={{marginBottom: 16, fontSize: '18px'}}>
                    This is your <strong>session #{sessionCount}</strong>.
                </Typography>
                <Typography variant="body2" style={{color: '#666'}}>
                    Continue exploring articles on your selected topic.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setWelcomeDialogOpen(false)} color="primary" variant="contained">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>

        {/* Weekly Survey Modal */}
        <Dialog 
            open={weeklySurveyOpen} 
            onClose={() => {}} 
            aria-labelledby="weekly-survey-title"
            maxWidth="md"
            fullWidth
            disableEscapeKeyDown
        >
            <DialogTitle id="weekly-survey-title">Topic Survey - {currentTopic || 'Loading...'}</DialogTitle>
            <DialogContent>
                 <Typography variant="h6" style={{marginTop: 32, marginBottom: 16, fontWeight: 600}}>
                    Please answer these questions about your attitudes toward  {" "}
                    <span style={{ color: "#3213e2" }}>
                        {<strong>{currentTopic || 'this topic'}</strong>}.
                    </span>{" "}  
                </Typography>

                {/* Question 1: Overall attitude (1-100 scale) */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    1. Where would you place your own view on a scale from 1 to 100?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Strongly oppose {currentTopic || 'this topic'}, 50 = Neutral or unsure, 100 = Strongly support {currentTopic || 'this topic'}
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.topicAttitude}
                        onChange={(e, value) => handleWeeklySurveySliderChange('topicAttitude', value)}
                        min={1}
                        max={100}
                        valueLabelDisplay="on"
                        marks={[
                            { value: 1, label: '1' },
                            { value: 50, label: '50 (Neutral)' },
                            { value: 100, label: '100' }
                        ]}
                    />
                </Box>

                {/* ONE SIDE Section */}
                <Typography variant="h6" style={{marginTop: 32, marginBottom: 16, fontWeight: 600}}>
                    Please rate {" "}
                    <span style={{ color: "#3213e2" }}>
                        {getTopicSides(currentTopic).oneSide}
                    </span>{" "} on the following traits:
                </Typography>

                {/* Q2: One Side - Openminded */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    2. How would you rate them on: Close-minded vs Open-minded
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Close-minded, 10 = Open-minded
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_openminded}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_openminded', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q3: One Side - Moderate */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    3. How would you rate them on: Extreme vs Moderate
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Extreme, 10 = Moderate
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_moderate}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_moderate', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q4: One Side - Moral */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    4. How would you rate them on: Immoral vs Moral
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Immoral, 10 = Moral
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_moral}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_moral', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* One Side - Social Distance */}
                 <Typography variant="h6" style={{marginTop: 32, marginBottom: 16, fontWeight: 600}}>
                    How happy would you feel if  {" "}
                    <span style={{ color: "#3213e2" }}>
                        {<strong>{getTopicSides(currentTopic).oneSide.replace('advocates', 'advocate')}</strong>}
                    </span>{" "} was your:
                </Typography>

                {/* Q5: One Side - Family */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    5. Immediate family member?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_family}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_family', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q6: One Side - Friend */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    6. Close friend?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_friend}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_friend', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q7: One Side - Coworker */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    7. Coworker?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.oneSide_coworker}
                        onChange={(e, value) => handleWeeklySurveySliderChange('oneSide_coworker', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* OTHER SIDE Section */}
                <Typography variant="h6" style={{marginTop: 32, marginBottom: 16, fontWeight: 600}}>
                    Please rate {" "}
                    <span style={{ color: "#3213e2" }}>
                        {<strong>{getTopicSides(currentTopic).otherSide}</strong>}
                    </span>{" "}  
                    on the following traits:
                </Typography>

                {/* Q8: Other Side - Openminded */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    8. How would you rate them on: Close-minded vs Open-minded
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Close-minded, 10 = Open-minded
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_openminded}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_openminded', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q9: Other Side - Moderate */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    9. How would you rate them on: Extreme vs Moderate
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Extreme, 10 = Moderate
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_moderate}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_moderate', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q10: Other Side - Moral */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    10. How would you rate them on: Immoral vs Moral
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Immoral, 10 = Moral
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_moral}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_moral', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Other Side - Social Distance */}
                 <Typography variant="h6" style={{marginTop: 32, marginBottom: 16, fontWeight: 600}}>
                    How happy would you feel if {" "}
                    <span style={{ color: "#3213e2" }}>
                        {<strong>{getTopicSides(currentTopic).otherSide.replace('advocates', 'advocate')}</strong>}
                    </span>{" "} was your:
                </Typography>

                {/* Q11: Other Side - Family */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    11. Immediate family member?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_family}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_family', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q12: Other Side - Friend */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    12. Close friend?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_friend}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_friend', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>

                {/* Q13: Other Side - Coworker */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    13. Coworker?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unhappy, 10 = Very happy
                </Typography>
                <Box style={{margin: '16px 0 32px 0'}}>
                    <Slider
                        value={weeklyData.otherSide_coworker}
                        onChange={(e, value) => handleWeeklySurveySliderChange('otherSide_coworker', value)}
                        min={1}
                        max={10}
                        valueLabelDisplay="on"
                        marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleWeeklySurveySubmit} color="primary" variant="contained">
                    Submit Survey
                </Button>
            </DialogActions>
        </Dialog>
        
        {/*<React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Attention"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Have you read the new post??
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>*/}
        
        
    </div>
    
    
    
)
}

export default withStyles(styles)(Feed);