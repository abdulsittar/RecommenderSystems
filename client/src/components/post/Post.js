
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
  
  // Use articleId to construct the correct article URL, fallback to webLinks for old posts
  const [webLink, setWebLink] = useState(
    post.articleId 
      ? `/news/article/${post.articleId}` 
      : post.webLinks
  );
  const [inputValue, setInputValue] = useState("");
  const linkify = linkifyit();
  
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef(null);
  const desc = useRef();
  const toastIdRef = useRef(null);
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'articleBackButtonClicked') {
        console.log(`Back button clicked for article ${event.data.articleId} (time spent: ${event.data.timeSpent}ms) - dismissing toast`);
        // Simply dismiss the toast when back button is clicked
        toast.dismiss();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
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
        const p = await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id }, { headers: { 'auth-token': token } });
        console.log("likeHandler");
        console.log(p);

        // Binary behavior: only 0 or 1 allowed
        // If clicking when like is 1, it goes to 0
        // If dislike is 1 and clicking like, both go to 0
        let newLike = 0;
        let newDislike = 0;
        
        if (p.data.likes === 1) {
          // We just added a like
          newLike = 1;
          newDislike = 0; // Ensure dislike is 0
        } else if (p.data.likes === -1) {
          // We just removed a like
          newLike = 0;
          newDislike = Number(dislike); // Keep dislike as is
        }
        
        // If there's a dislike change (removed when liking)
        if (p.data.dislikes === -1) {
          newDislike = 0;
        }
        
        setLike(newLike);
        setDislike(newDislike);
        
        // Update the toast content if it's open
        // Force re-render by using the new values directly in a new component instance
        if (toastIdRef.current) {
          setTimeout(() => {
            toast.update(toastIdRef.current, {
              render: () => <WebViewContent likeCount={newLike} dislikeCount={newDislike} />
            });
          }, 100);
        }

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
      const p = await axios.put("/posts/" + post._id + "/dislike", { userId: currentUser._id }, { headers: { 'auth-token': token } });
      console.log("dislike Handler");
        console.log(p);
      
        // Binary behavior: only 0 or 1 allowed
        // If clicking when dislike is 1, it goes to 0
        // If like is 1 and clicking dislike, both go to 0
        let newLike = 0;
        let newDislike = 0;
        
        if (p.data.dislikes === 1) {
          // We just added a dislike
          newDislike = 1;
          newLike = 0; // Ensure like is 0
        } else if (p.data.dislikes === -1) {
          // We just removed a dislike
          newDislike = 0;
          newLike = Number(like); // Keep like as is
        }
        
        // If there's a like change (removed when disliking)
        if (p.data.likes === -1) {
          newLike = 0;
        }
        
        setLike(newLike);
        setDislike(newDislike);
        
        // Update the toast content if it's open
        // Force re-render by using the new values directly in a new component instance
        if (toastIdRef.current) {
          setTimeout(() => {
            toast.update(toastIdRef.current, {
              render: () => <WebViewContent likeCount={newLike} dislikeCount={newDislike} />
            });
          }, 100);
        }

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

  // Create a component that will re-render with state changes
  // Accept props to force re-render with new values
  const WebViewContent = ({ likeCount = like, dislikeCount = dislike }) => (
    <div style={{
          width: '1000px',
          maxWidth: '95vw',
          height: '1000px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '0px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          position: 'relative'
      }}>
          {/* Green bar at the top of the webview */}
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#4CAF50',
            borderRadius: '10px 10px 0 0',
            marginBottom: '0px',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '9999'
          }}></div>
          
          <div style={{ padding: '15px 15px 15px 15px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <iframe 
                  src={webLink} 
                  title="WebView"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  style={{
                      width: '100%',
                      height: '2000px',
                      border: 'none',
                      borderRadius: '8px',
                  }}
                  onLoad={() => {
                    // Article open time is already tracked in toggleWebView
                    // Back button in iframe sends postMessage to parent
                  }}
              />
              
              {/* Like/Dislike buttons at the bottom */}
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '30px',
                padding: '20px 15px',
                backgroundColor: '#f9f9f9',
                borderTop: '2px solid #e0e0e0',
                position: 'sticky',
                bottom: '0',
                zIndex: '9998',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likeHandler();
                  }}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#555',
                    border: '2px solid #ddd',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <img 
                    src={`${PF}clike.png`} 
                    alt="Like" 
                    style={{ 
                      width: '24px', 
                      height: '24px'
                    }} 
                  />
                  <span>{likeCount}</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dislikeHandler();
                  }}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    color: '#555',
                    border: '2px solid #ddd',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <img 
                    src={`${PF}cdislike.png`} 
                    alt="Dislike" 
                    style={{ 
                      width: '24px', 
                      height: '24px'
                    }} 
                  />
                  <span>{dislikeCount}</span>
                </button>
              </div>
          </div>
      </div>
  );

  const toggleWebView = async () => {
    setHasReadArticle(true);
    
    console.log("🟢 toggleWebView called - Adding green bar!");
    
    try {
        const token = localStorage.getItem('token');
        const lc = await axios.post("/posts/" + currentUser._id + "/track-view", 
            {postId: post._id, userId: currentUser._id}, 
            {headers: { 'auth-token': token }}
        );
        console.log("Viewpost updated successfully.");
        
        // Fetch updated user data to see current readPosts count
        const userRes = await axios.get(`/users/${currentUser._id}`, {
            headers: { 'auth-token': token }
        });
        const articlesRead = userRes.data?.sessionReadPosts?.length || 0;
        console.log(`📊 Article tracking updated. Articles read in this session: ${articlesRead}`);
        
    } catch (error) {
        console.error("Error updating view post:", error);
    }
    
    const id = toast.info(
      <WebViewContent />,
      {
          className: "custom-toast",
          position: "top-center",
          icon: false,
          autoClose: false,
          hideProgressBar: true,
          closeButton: false,
          style: {
              width: 'auto',
              maxWidth: '95vw',
              padding: '0px',
              margin: '0px'
          }
      }
  );
  
  toastIdRef.current = id;
};


  const toggleWebView3 = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post("/posts/" + currentUser._id + "/track-view", 
            {
                postId: post._id, 
                userId: currentUser._id
            },
            {
                headers: { 'auth-token': token }
            }
        );

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
                padding: '0px',
                position: 'relative',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Green bar at the top of the webview */}
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#4CAF50',
                  borderRadius: '10px 10px 0 0',
                  marginBottom: '0px'
                }}></div>
                
                <div style={{ padding: '15px 15px 15px 15px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <iframe 
                        src={webLink} 
                        title="WebView"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        style={{
                            width: '100%', 
                            height: '100%', 
                            border: 'none', 
                            borderRadius: '8px',
                        }}
                        onLoad={() => {
                          // Back button uses postMessage to communicate with parent
                        }}
                    />
                </div>

                {/*<button 
                    onClick={() => toast.dismiss()} 
                    style={{
                        position: 'absolute',
                        top: '35px',
                        right: '25px',
                        padding: '8px 16px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        zIndex: '10000'
                    }}
                >
                    Zatvori
                </button>*/}
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
              width: '80vw', 
              height: '80vh', 
              backgroundColor: 'white', 
              overflow: 'hidden',
              borderRadius: '10px',
              position: 'relative'
          }}
      >
          {/* Green bar at the top of the webview */}
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#4CAF50',
            borderRadius: '10px 10px 0 0',
            marginBottom: '0px'
          }}></div>
          
          <div style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              position: 'relative',
              padding: '15px 15px 15px 15px',
              boxSizing: 'border-box'
          }}>
              <iframe src={webLink} title="WebView"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px',
                      display:'block'
                  }}
                  onLoad={() => {
                    // Back button uses postMessage to communicate with parent
                  }}
              />
          </div>
          
          {/*<button 
              onClick={() => toast.dismiss()} 
              style={{
                  position: 'absolute',
                  top: '35px',
                  right: '25px',
                  padding: '10px 20px',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  zIndex: '10000'
              }}
          >
              Zatvori
          </button>*/}
      </div>,
      {
          position: "top-center",
          autoClose: false,
          hideProgressBar: true,
          closeButton: false,
          className: "webview-toast-container",
          style: {
              width: 'auto',
              maxWidth: '95vw',
              padding: '0px',
              margin: '0px'
          }
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
      
      {/* Green bar at the top of the post */}
      <div style={{ 
        width: '100%', 
        height: '4px', 
        backgroundColor: '#4CAF50',
        borderRadius: '2px 2px 0 0'
      }}></div>

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
            {/* Removed user profile and metadata for news-style layout */}
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
              {/* News-style headline (big bold text) */}
              {!isDetail && (
                <div style={{ 
                  background: repost>0 ? "#F5F5F5" : "#ffffff",
                  marginBottom: '12px'
                }}>
                  <h2 style={{ 
                    fontSize: '22px', 
                    fontWeight: 'bold', 
                    margin: '0 0 8px 0',
                    letterSpacing: '0.5px',
                    lineHeight: '1.3',
                    color: '#000'
                  }}>
                    {/* Use title field if available, otherwise fallback to desc */}
                    {post?.title || (post?.desc ? post.desc.replace(/<[^>]*>/g, '') : '')}
                  </h2>
                </div>
              )}
              
              {/* Preview text - first sentence (non-bold text) - only show if title exists */}
              {!isDetail && post?.title && post?.desc && (
                <div style={{ 
                  fontSize: '15px', 
                  color: '#555',
                  marginBottom: '12px',
                  lineHeight: '1.6',
                  background: repost>0 ? "#F5F5F5" : "#ffffff"
                }}>
                  {post.desc.replace(/<[^>]*>/g, '')}
                </div>
              )}
              
              {/* Full content for detail view */}
              {isDetail && (
                <div className={classes.content}  style={{ background: repost>0 ? "#F5F5F5" : "#ffffff" }} dangerouslySetInnerHTML={{ __html: post?.desc }}></div>
              )}
              
            {!isDetail && !["pro ukraine", "pro russia", "mixed", "neutral", "neutral", "neutral"].includes(post.content) && (<button 
                onClick={toggleWebView} 
                style={{ 
                  display: 'inline-block', 
                  verticalAlign: 'middle', 
                  padding: '10px 24px', 
                  margin: '8px 0',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
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
        
        {/* Debug Post Metadata Overlay */}
        {/* Post metadata debug info - always visible during testing */}
        <div style={{
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 0, 0.15)',
            border: '1px solid #ffcc00',
            borderRadius: '4px',
            fontSize: '11px',
            marginTop: '10px',
            fontFamily: 'monospace'
        }}>
            <div><strong>Article ID:</strong> {post.articleId || 'N/A'}</div>
            <div><strong>Perspective Score:</strong> {post.perspectiveScore?.toFixed(2) || 'N/A'} <span style={{color: '#666'}}>({post.perspectiveScore != null ? ((post.perspectiveScore + 1) * 50).toFixed(1) : 'N/A'} on 0-100 scale)</span></div>
            <div><strong>Stance:</strong> {post.stance || 'N/A'}</div>
            <div><strong>Strength:</strong> {post.strength || 'N/A'}</div>
            <div><strong>Topic:</strong> {post.content || 'N/A'}</div>
            <div style={{ fontSize: '10px', marginTop: '4px', fontStyle: 'italic', color: '#666' }}>
                📊 Post metadata (always visible for testing)
            </div>
        </div>
        
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
