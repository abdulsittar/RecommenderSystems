
import { useContext, useEffect, useState, useRef } from "react";
import { format } from 'timeago.js'
import { AuthContext } from "../../context/AuthContext";
import Icon from '@material-ui/core/Icon'
import axios from "axios"
import { MoreVert } from '@material-ui/icons';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './postStyle'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import CommentSA from '../comment/commentSA';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Linkify from 'react-linkify';
import SendIcon from '@mui/icons-material/Send';
import { useMediaQuery } from 'react-responsive';
//import 'emoji-mart/css/emoji-mart.css';
import InputEmoji from "react-input-emoji";
import MoodIcon from '@mui/icons-material/Mood';
import React from 'react';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { InView } from 'react-intersection-observer';
import { COLORS } from "../values/colors";
import linkifyit from 'linkify-it';
import { Write_something, comments } from '../../constants';
import './post.css';
import { toast } from 'react-toastify';
//import User from "../../../../server/models/User";
import * as timeago from 'timeago.js';

// Add this after the imports
const srLatinLocale = (number, index) => {
  return [
    ['malopre', 'upravo sada'],
    ['pre %s sekundi', 'za %s sekundi'],
    ['pre 1 minut', 'za 1 minut'],
    ['pre %s minuta', 'za %s minuta'],
    ['pre 1 sat', 'za 1 sat'],
    ['pre %s sati', 'za %s sati'],
    ['pre 1 dan', 'za 1 dan'],
    ['pre %s dana', 'za %s dana'],
    ['pre 1 nedelju', 'za 1 nedelju'],
    ['pre %s nedelja', 'za %s nedelja'],
    ['pre 1 mesec', 'za 1 mesec'],
    ['pre %s meseci', 'za %s meseci'],
    ['pre 1 godinu', 'za 1 godinu'],
    ['pre %s godina', 'za %s godina']
  ][index];
};


// In the component or at the top level, register the Serbian locale:
timeago.register('sr', srLatinLocale);

function Post({onScrolling,  post, classes, isDetail, setHasReadArticle, currentRound}) {
  const [comments, setComments] = useState([]);
  const inputEl = React.useRef<HTMLInputElement>(null);
  //console.log(post);
  const [like, setLike] = useState(post.likes.length);
  const [dislike, setDislike] = useState(post.dislikes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLikedByOne, setIsLikedByOne] = useState(false);
  const [isDislikedByOne, setIsDislikedByOne] = useState(false);
  
  const [currentPost, setCurrentPost] = useState(post);

  const [repost, setRepost] = useState(post.reposts? post.reposts.length: 0);
  const [repostUser, setRepostUser] = useState({});
  const [repostId, setRepostId] = useState(post.reposts[post.reposts? post.reposts.length: 0]);
  
  
  const [rank, setRank] = useState(parseFloat(post.rank.toFixed(2)));//useState(post.reposts? post.reposts.length: 0);

  const [isReposted, setIsReposted] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
const [webViewUrl, setWebViewUrl] = useState('');

  
  const [isNew, setIsNew] = useState(false);

  const [user, setUser] = useState({});
  const [text, setText] = useState('');
  
  const [webLink, setWebLink] = useState(post.webLinks);
  const [inputValue, setInputValue] = useState("");
  const linkify = linkifyit();
  
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef(null);
  const desc = useRef();
  const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)"});
  const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)"});
  const extractUrls = require("extract-urls");
  let url = "https://edition.cnn.com/2024/07/10/europe/russian-missile-strike-kyiv-hospital-un-intl-hnk/index.html"
  const [urls, setUrls] = useState(post.thumb);
  const [thumbnail, setThumbnail] = useState('');
  //const [thumbnail, setThumbnail] = useState('/images/16251726578112.jpeg');
  var cover = true;
  // State for controlling popup visibility
  
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isHovered, setIsHovered] = useState(false);
  const [isDisHovered, setIsDisHovered] = useState(false);
  
 useEffect(() => {
  // Check if the post is new
  setIsNew(post.createdAt ? false : true);

  // Define the function to fetch the thumbnail
  const handleFetchThumbnail = async () => {
    if (!post.thumb) {
      console.log("No thumbnail URL provided.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/posts/fetch-thumbnail', { 
       urls: post.thumb, 
        headers: { 'auth-token': token }
      });
      setThumbnail(response.data.thumbnail);
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
    }
  };

  // Fetch thumbnail only if there is a thumbnail URL and it hasn't been fetched already
  if (post.thumb && !thumbnail) {
    handleFetchThumbnail();
  }
}, [post.thumb, thumbnail]);
  
      const handleMouseEnter = e => {
        setIsHovered(true);
      };

      const handleMouseLeave = e => {
        setIsHovered(false);
      };

      const handleDisMouseEnter = e => {
        setIsDisHovered(true);
      };

      const handleDisMouseLeave = e => {
        setIsDisHovered(false);
      };
      
      const onButtonClick = () => {
        // `current` points to the mounted text input element
        inputEl.current.focus();
      };
  //console.log("here is the url")
  //console.log(PF)
    /*const fetchComments = async () => {
    console.log("fetchComments")
    const res = await axios.get( + user._id+`?page=${index}`);
    console.log(res.data)
    console.log("fetch posts")
    if(res.data.length > 0){
      setPosts((prevItems) => [...prevItems, ...res.data
      //.sort((p1,p2) => {return new Date(p2.createdAt) - new Date(p1.createdAt);})
      ]); 
    res.data.length > 0 ? setHasMore(true) : setHasMore(false);
      //setIndex((index) => index + 1);
      increment(index, 1);
    } else {
      //setPosts([]);
      //setIndex((index) => 0);
      //increment(index, -index);
    }

      //setPreFilter(whPosts);
      console.log(whPosts);
      //setPosts(res.data.sort((p1,p2) => {return new Date(p2.createdAt) - new Date(p1.createdAt);})); 
  };*/


  useEffect(() => {
    //setIsLiked(post.likes.includes(currentUser._id));
    //setIsLikedByOne(post.likes.length == 1)
    //setIsDisliked(post.dislikes.includes(currentUser._id));
    //setIsDislikedByOne(post.dislikes.length == 1)
    setComments(post.comments);

  }, [currentUser._id, post.likes, post.dislikes]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`, {headers: { 'auth-token': token }})
      setUser(res.data);
    };
    
    const fetchLastRepostUser = async () => {
      console.log("repostId")
    console.log(post.reposts[post.reposts.length-1])
      const res = await axios.get(`/users?userId=${post.reposts[post.reposts.length-1]}`, {headers: { 'auth-token': token }})
      setRepostUser(res.data);
    };
  
    
    //console.log(post.comments.length)
    fetchUser();
    if(post.reposts.length > 0){
      fetchLastRepostUser();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsVisible(true);
      }
    };
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  function handleChange(text) {
    setInputValue(text)
    console.log("enter", text);

  }

  const handleReadChange = () => {
    const token = localStorage.getItem('token');
      axios.put("/users/" + currentUser._id + "/read", 
      { postId: post._id, 
        headers: { 'auth-token': token }
      });
  };

  function handleOnEnter(text) {
    console.log("enter", text);
  }

  // postDetails
  const postDetailsHandler = async (e) => {
    e.preventDefault();
  };


  // submit a comment
  const onEnterSubmitHandler = async () => {

    const token = localStorage.getItem('token');
    //setInputValue(prevValue => prevValue + "\n");
    console.log(removeHtmlTags(inputValue).trim().length);
    console.log("currentUser")
    console.log(currentUser)
    if(removeHtmlTags(inputValue).trim().length != 0){
    try {
      setInputValue('');
      const lc = await axios.post("/posts/" + post._id + "/comment", { userId: currentUser._id, username: currentUser.username, txt: inputValue, postId: post._id, headers: { 'auth-token': token } });
      console.log("Posted a comment");
      console.log(lc.data)
      //setComments([...comments, lc.data]);
      //post.comments([...comments, lc.data]);
      setComments((prevItems) => [...prevItems, lc.data]);
      setInputValue('');
      const po = await axios.get("/posts/" + post._id, { headers: { 'auth-token': token } });
      console.log("post");
      console.log(po.data);
      console.log(post);
      setCurrentPost(po.data);
      // refresh the page after posting something
      //window.location.reload();
    } catch (err) { 
      console.log("Posted a comment");
      console.log(err); }
  }
};

const submitHandler2 = async (e) => {
  e.preventDefault();
  
};


  // submit a comment
  const submitHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(removeHtmlTags(inputValue).trim().length);
    console.log("currentUser")
    console.log(currentUser)
    if(removeHtmlTags(inputValue).trim().length != 0){
    const newComment = { userId: user._id, description: inputValue,};
    console.log(newComment);
    try {
      setInputValue('');
      const lc = await axios.post("/posts/" + post._id + "/comment", { userId: currentUser._id, username: currentUser.username, txt: inputValue, postId: post._id, headers: { 'auth-token': token } });
      console.log("Posted a comment");
      console.log(lc.data)
      //setComments([...comments, lc.data]);
      //post.comments([...comments, lc.data]);
      setComments((prevItems) => [...prevItems, lc.data]);
      setInputValue('');
      const po = await axios.get("/posts/" + post._id, { headers: { 'auth-token': token } });
      console.log("post");
      console.log(po.data);
      console.log(post);
      setCurrentPost(po.data);
      // refresh the page after posting something
      //window.location.reload();
    } catch (err) { 
      console.log("Posted a comment");
      setInputValue('');
      console.log(err); }
    }
  };

  /*const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) { }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    if (post.likes.length == 1){
      setIsLikedByOne(false);
    }
  };*/


  const repostHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      axios.post("/posts/" + post._id + "/repost", { userId: currentUser._id , headers: { 'auth-token': token }});
    } catch (err) {
      console.log(err)
     }
    setRepost(isReposted ? repost + 1 : repost + 1);
    setIsReposted(true);

  };

  function getTextLength(text) {
    // Regular expression to match URLs starting with "http://" or "https://"
    const urlRegex = /(https?:\/\/\S+)/g;
    
    // Remove URLs from the text
    const textWithoutUrls = text.replace(urlRegex, '');
    
    // Calculate the length of the text without URLs
    const lengthWithoutUrls = textWithoutUrls.length;
    
    return lengthWithoutUrls;
}

  const likeHandler = async () => {
    //if(!isDisliked){
      const token = localStorage.getItem('token');
      try {
        const p = await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id, headers: { 'auth-token': token } });
        console.log("likeHandler");
        console.log(p);

        //console.log(p.data.likes.length);
        //if(p.data.likes.length > 0){
        const vl = Number(like) + p.data.likes
        if(vl < 0){setLike(0);}else{setLike(vl);}

        const vl2 = Number(dislike) + p.data.dislikes
        if(vl2 < 0){setDislike(0);}else{setDislike(vl2);}

        //}else{
        //  setLike(0);
        //}
        //if(p.data.dislikes.length > 0){
        
        //}else{
           // setDislike(0);
        //}
        
      } catch (err) { console.log(err); }
    
    //if (p.likes.length == 1){
    //  setIsLikedByOne(false);
    //}
   /* }else{
      try {
        const totLikes = axios.put("/posts/" + post._id + "/dislike", { userId: currentUser._id });

        console.log(totLikes.length);
        setDislike(totLikes.length);
        if(totLikes.length > 0){
          setIsDisliked(totLikes.includes(currentUser._id));}else{setIsDisliked(false);}
      } catch (err) {console.log(err);}
  }*/
  };

  const dislikeHandler = async () => {
    //if(!isLiked){
      const token = localStorage.getItem('token');
    try {
      const p = await axios.put("/posts/" + post._id + "/dislike", { userId: currentUser._id, headers: { 'auth-token': token } });
      console.log("dislike Handler");
        console.log(p);
      //if(p.data.likes.length > 0){
        const vl = Number(like) + p.data.likes
        if(vl < 0){setLike(0);}else{setLike(vl);}

        const vl2 = Number(dislike) + p.data.dislikes
        if(vl2 < 0){setDislike(0);}else{setDislike(vl2);}

      //}else{
      //  setLike(0);

      //}

      //if(p.data.dislikes.length > 0){
          //setDislike(p.data.dislikes.length);
      //}else{
      //    setDislike(0);
      //}

    } catch (err) {console.log(err);}
    
    //if (p.dislikes.length == 1){
    //  setIsDislikedByOne(false);
    //}
 /* }else{
    setIsLiked(false);

    try {
      const totLikes = axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });

      console.log(totLikes.length);
      setLike(totLikes.length);
      if(totLikes.length > 0){
        setIsLiked(totLikes.includes(currentUser._id));}else{setIsLiked(false);}

    } catch (err) { console.log(err);
    }
  }*/
  };

  const toggleWebView = async () => {
    setHasReadArticle(true);
    
    try {
        const token = localStorage.getItem('token');
        const lc = await axios.post("/posts/" + currentUser._id + "/track-view", {postId: post._id, userId: currentUser._id, headers: { 'auth-token': token }});
        console.log("Viewpost updated successfully.");
        
    } catch (error) {
        console.error("Error updating view post:", error);

    }
    
    toast.info(
      <div style={{
          width: '1000px', // Enforce width inside the toast content
          maxWidth: '100vw',
          height: '1000px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '15px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
      }}>
          <iframe 
              src={webLink} 
              title="WebView"
              style={{
                  width: '100%',
                  height: '2000px',
                  border: 'none',
                  borderRadius: '8px',
              }}
          />
          <button 
              onClick={() => toast.dismiss()} 
              style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
              }}
          >
              Zatvori
          </button>
      </div>,
      {
          className: "custom-toast", // Custom styling
          position: "top-center",
          icon: false,
          autoClose: false,
          hideProgressBar: true,
          closeButton: false,
      }
  );
};


  const toggleWebView3 = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post("/posts/" + currentUser._id + "/track-view", {
            postId: post._id, 
            userId: currentUser._id,
            headers: { 'auth-token': token }
        });

        console.log("Viewpost updated successfully.");
    } catch (error) {
        console.error("Error updating view post:", error);
    }
    
    toast.info(
        <div 
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100vw', 
                height: '100vh', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                position: 'fixed', 
                top: 0, 
                left: 0, 
                zIndex: 1000,
            }}
        >
            <div style={{
                width: '600px', // Fixed width
                height: '80vh', // Responsive height
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '15px',
                position: 'relative',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <iframe 
                    src={webLink} 
                    title="WebView"
                    style={{
                        width: '100%', 
                        height: '100%', 
                        border: 'none', 
                        borderRadius: '8px',
                    }}
                />

                <button 
                    onClick={() => toast.dismiss()} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Zatvori
                </button>
            </div>
        </div>,
        {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeButton: false,
            className: "webview-toast-container",
        }
    );
};

  const toggleWebView2 = async () => {
    const screenWidth = window.innerWidth; // Get the screen width
    //const iframeWidth = screenWidth <= 800 ? '65vh' : '125vh'; // Adjust width based on screen size
  
    let iframeWidth;
    if (screenWidth < 550) {
        iframeWidth = '45vh';  // Very small screens
    } else if (screenWidth >= 550 && screenWidth < 600) {
        iframeWidth = '45vh';  // Small screens
    } else if (screenWidth >= 731 && screenWidth < 730) {
        iframeWidth = '45vh';  // Slightly larger screens
    } else if (screenWidth >= 731 && screenWidth < 800) {
        iframeWidth = '45vh';  // Medium screens
    } else if (screenWidth >= 801 && screenWidth < 1200) {
        iframeWidth = '45vh';  // Large screens
    } else {
        iframeWidth = '45vh';  // Extra large screens
    }
    
    iframeWidth = '25vh';
    
    try {
      const token = localStorage.getItem('token');
      const lc = await axios.post("/posts/" + currentUser._id + "/track-view", {postId: post._id, userId: currentUser._id, headers: { 'auth-token': token }});
      
      
      console.log("Viewpost updated successfully.");
  } catch (error) {
      console.error("Error updating view post:", error);
  }
    
    toast.info(
      <div 
          style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              //justifyContent: 'center',
              width: '80vw', 
              height: '80vh', 
              backgroundColor: 'white', 
              overflow: 'hidden',
              //padding: '10px',
          }}
      >
          <div style={{
              width: '85vw', // Keeps it within screen bounds
              maxWidth: '1500px', // Prevents extra stretching
              height: '90vh',
              overflow: 'auto',
              position: 'relative',
          }}>
          
        
              <iframe src={webLink} title="WebView"
                  style={{
                      width: '25vw',
                      height: '100%',
                      border: 'none',
                      //zoom: '0.95', // Shrinks content slightly to fit
                      objectFit: 'cover', // Ensures full visibility
                      overflow: 'auto',
                      display:'block'
                  }}
              />
          </div>
          
          <button 
              onClick={() => toast.dismiss()} 
              style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
              }}
          >
              Zatvori
          </button>
      </div>,
      {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeButton: false, // Using a custom close button
          className: "webview-toast-container",
      }
  );

};

  const showCommentsHandler = () => {
    var bottomdiv = document.getElementsByClassName("form")
    bottomdiv.style.display="none";
  }

  function removeHtmlTags(text) {
    // Regular expression to match HTML tags
    const htmlRegex = /<[^>]*>/g;
    
    // Remove HTML tags from the text  "https://socialapp2.ijs.si/news/zelensky-ukraine-must-be-included"
    const textWithoutHtml = text.replace(htmlRegex, '');
    
    return textWithoutHtml;
    
}

const triangleStyle = {
  position: "relative",
  margin: isDetail && "5px 0",
  background:  "#F5F5F5" 
};

const triangleOverlayStyle = {
  content: '""',
  position: "absolute",
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  borderLeft: isNew && "50px solid blue", // Adjust size as needed
  borderBottom: "50px solid transparent" // Adjust size as needed
};


  function handleViewedChange(view, post) {
    /*if(view == true){
    console.log("view ", view);
    onScrolling(post._id);
    }*/
  }
  //<img src={PF + post.img} alt="" className={classes.postImg} />
  //to={isDetail? `/profile/${repostUser.username}`: `/profile/${repostUser.username}` }
  // to={isDetail? `/profile/${repostUser.username}`: `/profile/${repostUser.username}`}
  //to={isDetail? `/profile/${user.username}`: `/profile/${user.username}` }
  //to={isDetail? `/profile/${user.username}`: `/profile/${user.username}`}
  //

  return (
    <InView as="div" onChange={(inView, entry) => handleViewedChange(inView, post)}>
    <div className={classes.post} style={{ position: "relative", margin: isDetail && "5px 0",  background: repost > 0 ? "#F5F5F5" : "#ffffff"}}  >
      <div className={classes.postWrapper} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
      

      <div style={triangleOverlayStyle}></div>
        <div className={classes.postTop} style={{ background: repost>0 ? "#ffffff" : "#ffffff" }}>
        {(repost > 0)? 
          <div className={classes.postTopLeft}>
            <Link  style={{textDecoration: 'none', color: COLORS.textColor}} >
              <img src={repostUser.profilePicture ? PF + repostUser.profilePicture : PF + 'person/noAvatar.png'} alt="" className={classes.postProfileImg} />
            </Link>
            <Link style={{textDecoration: 'none', color: COLORS.textColor, cursor:'default'}}>
            <span className={classes.postUsername}>{repostUser.username}</span>
            </Link>
            <span className={classes.postDate}>{format(post.updatedAt)}</span>
            <span className={classes.postDate} style={{margin: '0px 0px 0px 20px',}}>{" Reposted by: "+ repost}</span>
          
          </div>: <div></div>}
          { /*(repost > 0)? 
          <div className={classes.postTopRight}>
          <Link style={{textDecoration: 'none', color: COLORS.textColor}} onClick={repostHandler}>
            
          { (isMobileDevice && isTabletDevice) ? <Stack direction="row" spacing={2}>
            <Button variant="contained" endIcon={<SendIcon />}> Repost </Button></Stack> :<ArrowForwardIcon /> }  </Link></div>: <div></div>*/}

        </div>
        
        <div className={classes.postTop} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
        
          <div className={classes.postTopLeft} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
            <Link  style={{textDecoration: 'none', color: COLORS.textColor, background: repost>0 ? "#F5F5F5" : "#ffffff"}} >
              <img src={user.profilePicture ? PF + user.profilePicture : PF + 'person/noAvatar.png'} alt="" className={classes.postProfileImg} />
            </Link>
            <Link style={{textDecoration: 'none', color: COLORS.textColor, cursor:'default', background: repost>0 ? "#F5F5F5" : "#ffffff"}} >
            <span className={classes.postUsername}>
              {user.username}
            </span>
            </Link>
            <span className={classes.postDate} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>{format(post.createdAt, 'sr')}</span>
            {<span className={classes.postDate} style={{margin: '0px 0px 0px 20px',}}>{"group= "+ post.userGroup +" | round# "+ post.treatment+" | post label= "+ post.content+" | ranking= "+post.rank+" | ukraine score= "+post.ukraine+" | disinfo score= "+post.disinfo}</span>}
          </div>
          
          { /*(repost < 1)?
          <div className={classes.postTopRight} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
          <Link style={{textDecoration: 'none', color: COLORS.textColor}} onClick={repostHandler}>
            
          { (isMobileDevice && isTabletDevice) ? <Stack direction="row" spacing={2}>
            <Button variant="contained" endIcon={<SendIcon />}> Repost </Button></Stack> :<ArrowForwardIcon /> }  </Link></div>: <div></div>
  */}

        </div>
        
        <div className={classes.postCenter} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
        <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<a target="blank" rel="noopener noreferrer" href={decoratedHref} key={key} > {decoratedText} </a>)}>
          <div className={classes.postText}  style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
            {/*!isDetail && post?.desc.length > 0? */}
              <div className={classes.content}  style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }} dangerouslySetInnerHTML={{ __html: post?.desc }}> 
              
                  {/*<Link to={{pathname:`/postdetail/${user.username}`, state:{myObj: currentPost}}}></Link>*/}
                </div>
            {!isDetail && !["pro ukraine", "pro russia", "mixed", "neutral", "neutral", "neutral"].includes(post.content) && (<button 
                onClick={toggleWebView} 
                style={{ display: 'inline-block', verticalAlign: 'middle', padding: '0px 20px', margin: '0px 20px'}}>
                Read full article
            </button>)}
            {/*}:
            <div className={classes.postText}  style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }} dangerouslySetInnerHTML={{ __html: post?.desc }}>
             </div>}*/}
            
            
            {thumbnail && (
              <div  style={{ marginTop:"20px", background: repost>0 ? "#F5F5F5" : "#ffffff", display: 'flex', justifyContent: 'center',alignItems: 'center',}}>
                  <img src={thumbnail} alt="Thumbnail" style={{ width: '100%', maxWidth: '600px', height: 'auto',cursor: 'default' }} />
              </div>
          )}
           </div>
        </Linkify>
          
          
        </div>
        <div className={classes.postBottom} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
          <div className={classes.postBottomLeft} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
            <img src={`${PF}clike.png`} alt="" className={classes.likeIcon} onClick={likeHandler} />
            <span className={classes.postLikeCounter}>{like}</span>
                  
            <img src={`${PF}cdislike.png`} alt="" className={classes.likeIcon} onClick={dislikeHandler} />
            <span className={classes.postDislikeCounter}>{dislike}</span>
            <form class = "form">
            <SendIcon className={classes.sendButton2} style={{ display:"flex", margin:"0px 20px"}} type="submit" onClick={submitHandler2}/>
            </form>
          </div>
          <div className={classes.postBottomRight} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
          <Link style={{textDecoration: 'none', color: COLORS.textColor}} to={{pathname:`/postdetail/${user.username}`, state:{myObj: currentPost}}}> <div className={classes.postCommentText} >{comments.length} {"Komentara"}</div></Link>
          </div>
        </div>
        {isDetail && (
        <div ref={ref} className={classes.commentsWrapper}  style={{ display: isVisible ? "block" : "none", background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
        <hr className={classes.shareHr} />
        
          <div className={classes.txtnButtonRight} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
            <CardHeader
              avatar={<Avatar className={classes.smallAvatar} src={currentUser.profilePicture? PF + currentUser.profilePicture: PF + "person/noAvatar.png"} style={{ background: repost>0 ? "#ffffff" : "#ffffff" }} />}
              title={<InputEmoji className={classes.shareInput} style={{ fontSize: "15", height: "40px", background: repost>0 ? "#ffffff" : "#ffffff" }} shouldReturn={true} value={inputValue}  onChange={handleChange}  onEnter={onEnterSubmitHandler} placeholder={Write_something} />}
              className={classes.cardHeader} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}/>

            <form class = "form">
              <SendIcon className={classes.sendButton2} style={{ display:"flex", margin:"0px 20px"}} type="submit" onClick={submitHandler}/>
            </form>
            </div>
            <div className={classes.commentTop} style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }}>
            {comments.slice(0).reverse().map((item, i) => {
              console.log(i);
              console.log(item._id);
                      //return <CommentSA key={item._id} post={post} comment={item} isDetail={false}/>
              if(isDetail===false && i < 1) {
                  return <CommentSA key={item._id} post={post} comment={item} isDetail={false}/>

              } else if(isDetail === true) {
                  return <CommentSA key={item._id} post={post} comment={item} isDetail={false}/>
                  
              }
              })
            }
        </div>
        </div>)}
      </div>
    </div>
    </InView>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}
export default withStyles(styles)(Post);
