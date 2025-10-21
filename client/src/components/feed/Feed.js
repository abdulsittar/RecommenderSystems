import React from 'react';
import {useState, useEffect} from 'react'
import Post from '../post/Post'
import Share from '../share/Share'
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
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
const { user: currentUser } = useContext(AuthContext);
const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
const [socket, setSocket] = useState(null)
const [open, setOpen] = React.useState(false);
    const [nextDialogOpen, setNextDialogOpen] = useState(false);
    const [nextSelectedOption, setNextSelectedOption] = useState('option1');
    const [currentTopic, setCurrentTopic] = useState(null); // Track the current topic for filtering posts
//const [hasReadArticle, setHasReadArticle] = useState(false);
 
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
            'other': 'option4'
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
            // Map options to topics for initial-data creation - Updated to match new categories
            const topicMapping = {
                option1: 'assisted death',    // Assisted Death
                option2: 'abortion',          // Abortion  
                option3: 'gun control',       // Gun Control
                option4: 'other'              // Other
            };
            const topic = topicMapping[nextSelectedOption] || 'abortion';
            console.log('handleNextConfirm - Selected option:', nextSelectedOption, 'Mapped topic:', topic);
            setCurrentTopic(topic); // Store the selected topic for filtering
            setNextDialogOpen(false);
            try {
                const token = localStorage.getItem('token');
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

return (
    <div className={classes.feed}>
    <LoadingBar   color="#f11946"   progress={progress}   onLoaderFinished={() => setProgress(0)} />
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
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 12}}>
                    <Button variant="contained" color="primary" onClick={handleOpenNextDialog}>
                        Next Page
                    </Button>
                </div>
                <Dialog open={nextDialogOpen} onClose={handleNextDialogClose} aria-labelledby="next-dialog-title">
                    <DialogTitle id="next-dialog-title">Select Next Page</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose one of the options below to load the corresponding page.
                        </DialogContentText>
                        <FormControl component="fieldset" style={{marginTop: 8}}>
                            <FormLabel component="legend">Pages</FormLabel>
                            <RadioGroup value={nextSelectedOption} onChange={handleNextOptionChange}>
                                <FormControlLabel value="option1" control={<Radio />} label="Assisted death" />
                                <FormControlLabel value="option2" control={<Radio />} label="Abortion" />
                                <FormControlLabel value="option3" control={<Radio />} label="Gun control" />
                                <FormControlLabel value="option4" control={<Radio />} label="Other" />

                            </RadioGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleNextDialogClose}>Cancel</Button>
                        <Button onClick={handleNextConfirm} color="primary">Confirm</Button>
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