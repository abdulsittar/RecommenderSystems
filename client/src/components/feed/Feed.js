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
        // Map current topic back to option value to show correct selection in dialog
        const topicToOptionMapping = {
            'assisted death': 'option1',
            'abortion': 'option2', 
            'gun control': 'option3',
            'nuclear power': 'option4',
            'social media regulation': 'option5',
            'military armament': 'option6',
            'climate action': 'option7'
        };
        const currentOption = topicToOptionMapping[currentTopic] || 'option1';
        setNextSelectedOption(currentOption);
        setNextDialogOpen(true);
    }

    const handleNextDialogClose = () => {
        setNextDialogOpen(false);
    }

    const handleNextOptionChange = (e) => {
        setNextSelectedOption(e.target.value);
    }

    const handleNextConfirm = async () => {
            // Map options to topics for initial-data creation - All 7 topics from articles.csv
            const topicMapping = {
                option1: 'assisted death',           // Assisted Death
                option2: 'abortion',                 // Abortion  
                option3: 'gun control',              // Gun Control
                option4: 'nuclear power',            // Nuclear Power
                option5: 'social media regulation',  // Social Media Regulation
                option6: 'military armament',        // Military Armament
                option7: 'climate action'            // Climate Action
            };
            const topic = topicMapping[nextSelectedOption] || 'abortion';
            console.log('handleNextConfirm - Selected option:', nextSelectedOption, 'Mapped topic:', topic);
            
            // Check if this is first topic selection OR topic changed
            const isFirstTopic = !currentTopic;
            const topicChanged = currentTopic && currentTopic !== topic;
            
            setCurrentTopic(topic); // Store the selected topic for filtering
            setNextDialogOpen(false);
            
            // Clear shown post IDs when topic changes
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

            // Submit weekly survey with topic
            const response = await axios.post('/users/weeklyResponse', {
                ...weeklyData,
                userId: user._id,
                topic: pendingTopic,
                weekNumber: weekNumber
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
                    console.log('User updated with new survey data:', {
                        stanceScore: userResponse.data.stanceScore,
                        overtonWindow: userResponse.data.overtonWindow,
                        currentTopic: userResponse.data.currentTopic
                    });
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

// Check if user needs to select a topic (first time) or show welcome message for recurring session
useEffect(() => {
    const showWeeklySurvey = localStorage.getItem('showWeeklySurvey');
    const weeklySurveyReason = localStorage.getItem('weeklySurveyReason');
    const isRecurringSession = localStorage.getItem('isRecurringSession');
    const storedSessionCount = localStorage.getItem('sessionCount');
    
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
    
    // Priority 1: Show welcome message for recurring sessions
    if (isRecurringSession === 'true' && storedSessionCount) {
        console.log('Recurring session detected - showing welcome message for session', storedSessionCount);
        setSessionCount(parseInt(storedSessionCount));
        setWelcomeDialogOpen(true);
        // Clear the flags after showing
        localStorage.removeItem('isRecurringSession');
        localStorage.removeItem('sessionCount');
        return; // Don't proceed to other checks
    }
    
    // Priority 2: If user doesn't have a current topic, show topic selection dialog FIRST
    if (user && !currentUser.currentTopic && !currentTopic) {
        console.log('User has no currentTopic set - showing topic selection dialog');
        setTimeout(() => {
            setNextDialogOpen(true);
        }, 500);
    }
    // Priority 3: If user has a topic AND flag is set, show weekly survey
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
    console.log("fetchPostsWithTopic with topic:", topicParam)
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
            
            // Collect current post IDs to exclude
            const currentPostIds = posts.map(p => p._id);
            const allExcludedIds = [...new Set([...shownPostIds, ...currentPostIds])];
            
            // Update shown post IDs with current posts before fetching new ones
            setShownPostIds(allExcludedIds);
            
            // Fetch new posts excluding already shown ones
            await fetchNewPostsExcluding(selectedValue, currentTopic, allExcludedIds);
        }
    };
    
    // Fetch new posts excluding already shown ones
    const fetchNewPostsExcluding = async (selectedValue, topicParam, excludeIds) => {
        setProgress(30);
        console.log("fetchNewPostsExcluding - excluding IDs:", excludeIds);
        
        var whPosts = "/posts/timelinePag/";
        if(selectedValue == 0){
            whPosts = "/posts/timelinePag/";
        } else if (selectedValue == 1){
            whPosts = "/posts/onlyFollowersPag/"
        } else if (selectedValue == 2){
            whPosts = "/posts/onlyFollowingsPag/"
        }
        
        const token = localStorage.getItem('token');
        
        // Build URL with topic and exclude parameters
        let url = `${whPosts}${user._id}?page=0`; // Always page 0, but with exclusions
        if (topicParam) {
            url += `&topic=${encodeURIComponent(topicParam)}`;
        }
        if (excludeIds && excludeIds.length > 0) {
            url += `&exclude=${excludeIds.join(',')}`;
        }
        
        console.log('fetchNewPostsExcluding - URL:', url);
        
        const res = await axios.get(url, {headers: { 'auth-token': token, 'userId': user._id }});
        console.log('fetchNewPostsExcluding - Got posts:', res.data.length);
        
        if(res.data.length > 0){
            setPosts(res.data);
            setProgress(100);
        } else {
            // No more new posts available - reset shown posts and start fresh
            console.log('No more new posts - resetting to start');
            setShownPostIds([]);
            // Fetch fresh posts without exclusions
            await fetchPostsWithTopic(selectedValue, 0, topicParam);
        }
        setProgress(100);
    };

return (
    <div className={classes.feed}>
    <LoadingBar   color="#f11946"   progress={progress}   onLoaderFinished={() => setProgress(0)} />
        
        {/* Debug Control Group Display - Always visible during testing */}
        {currentUser && (
            <div style={{
                position: 'fixed',
                top: 70,
                right: 10,
                padding: '12px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: 'white',
                borderRadius: '8px',
                zIndex: 9999,
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                minWidth: '200px'
            }}>
                <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', borderBottom: '1px solid #666', paddingBottom: '6px'}}>
                    🔬 Debug Info
                </div>
                <div><strong>Control Group:</strong> {currentUser.controlGroup || 'None'}</div>
                <div><strong>Stance:</strong> {currentUser.stanceScore?.toFixed(2) || 'N/A'}</div>
                <div><strong>Window:</strong> [{currentUser.overtonWindow?.min?.toFixed(1)}, {currentUser.overtonWindow?.max?.toFixed(1)}]</div>
                <div><strong>Topic:</strong> {currentUser.currentTopic || 'None'}</div>
            </div>
        )}
        
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
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleOpenNextDialog}
            >
                Change Topic
            </Button>
        </div>
        
        <InfiniteScroll dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<Loader />}>
        <div className={classes.feedWrapper} style={{"width": (!isMobileDevice && !isTabletDevice) && (windowSize.innerWidth-10)+"px"}}>
            {( !username || username === user.username) }
            {Array.isArray(posts) && posts.map((p) => (
  <Post
    onScrolling={updateViewdPosts}
    key={p._id}
    post={p}
    isDetail={false}
    setHasReadArticle={setHasReadArticle}
    currentRound={currentRound}
  />
))}

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
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleOpenNextDialog}
            >
                Change Topic
            </Button>
        </div>
                <Dialog open={nextDialogOpen} onClose={handleNextDialogClose} aria-labelledby="next-dialog-title">
                    <DialogTitle id="next-dialog-title">Change Topic</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose a topic to see posts about that subject.
                        </DialogContentText>
                        <FormControl component="fieldset" style={{marginTop: 8}}>
                            <FormLabel component="legend">Topics</FormLabel>
                            <RadioGroup value={nextSelectedOption} onChange={handleNextOptionChange}>
                                <FormControlLabel value="option1" control={<Radio />} label="Assisted Death" />
                                <FormControlLabel value="option2" control={<Radio />} label="Abortion" />
                                <FormControlLabel value="option3" control={<Radio />} label="Gun Control" />
                                <FormControlLabel value="option4" control={<Radio />} label="Nuclear Power" />
                                <FormControlLabel value="option5" control={<Radio />} label="Social Media Regulation" />
                                <FormControlLabel value="option6" control={<Radio />} label="Military Armament" />
                                <FormControlLabel value="option7" control={<Radio />} label="Climate Action" />
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
                <Typography variant="body1" style={{marginBottom: 24}}>
                    Please answer these questions about your attitudes toward <strong>{currentTopic || 'this topic'}</strong>.
                </Typography>

                {/* Question 1: Overall attitude (1-100 scale) */}
                <Typography variant="body1" style={{marginBottom: 8, fontWeight: 500}}>
                    1. On a scale from 1 to 100, how warm or favorable do you feel toward {currentTopic || 'this topic'}?
                </Typography>
                <Typography variant="caption" style={{fontStyle: 'italic', color: '#666', marginBottom: 16, display: 'block'}}>
                    1 = Very unfavorable, 50 = Neutral, 100 = Very favorable
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
                    Please rate {getTopicSides(currentTopic).oneSide} on the following traits:
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
                <Typography variant="body2" style={{marginTop: 24, marginBottom: 16, fontWeight: 500}}>
                    How happy would you feel if {getTopicSides(currentTopic).oneSide.replace('advocates', 'an advocate')} was your:
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
                    Please rate {getTopicSides(currentTopic).otherSide} on the following traits:
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
                <Typography variant="body2" style={{marginTop: 24, marginBottom: 16, fontWeight: 500}}>
                    How happy would you feel if {getTopicSides(currentTopic).otherSide.replace('advocates', 'an advocate')} was your:
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