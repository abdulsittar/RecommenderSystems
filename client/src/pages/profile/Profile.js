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
import {styles} from './profileStyle';
import { useMediaQuery } from 'react-responsive';
import TextField from '@material-ui/core/TextField'
import { colors } from '@material-ui/core';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import {regSw, subscribe} from '../../helper.js';
import TimeMe from "timeme.js";
import {Failed_Update_profile, Profile_Saved, Save_profile, Select_from_Gallery } from '../../constants';

//import { ToastProvider, useToasts } from 'react-toast-notifications';

//import showToast from "../../components/toastify/toastify";

//import User from '../../../../server/models/User';
function Profile({ classes }) {
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [preImage, setPreImage] = useState(null);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [bio, setBio] = useState("");
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
    const [shouldSendEvent, setShouldSendEvent] = useState(false);

  /*const YourComponent = () => {
  const { addToast } = useToasts();

  const showToast = () => {
    addToast('Your message here', { appearance: 'success' });
  };

  return (<></>);
  <ToastProvider>
          <YourComponent/>
        </ToastProvider>
};*/

useEffect(() => {
  const pushResponse = async () => {
    /*try {
      const serviceWorkerReg = await regSw ();
    //subscribe(serviceWorkerReg);
      console.log(serviceWorkerReg);
        const options = {}
        let subscription = await serviceWorkerReg.pushManager.subscribe ({
          userVisibleOnly: true,
          applicationServerKey: process.env.APP_SERVER_KEY,
        });
        console.log(subscription);
        //const res = axios.post(`/posts/subscribe`, subscription);
        console.log (" pushing notification");
        //console.log(res)

      } catch (err){
        console.log('Error', err);

      }*/
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/users?username=${username}`, {headers: { 'auth-token': token }})
    console.log("fetch user");
    console.log(res.data)
    setUsr(res.data);
    console.log(usr);
    setPrevUN(username);
};
//if(isProfileFetched){
  pushResponse();
  fetchUser();
  setIsProfileFetched(false);
//}
}, [username]);


/* useEffect(() => {
  TimeMe.initialize({
    currentPageName: "ProfilePage", // current page
    idleTimeoutInSeconds: 15 // seconds
    });

    TimeMe.callWhenUserLeaves(() => {
    setShouldSendEvent(true);
    });
  
    TimeMe.callWhenUserReturns(() => {
    setShouldSendEvent(false);
    });

  }, []); */


    useEffect(() => {
      setFollowed(currentUser.followings.includes(usr._id));
        //setSelectedImage(usr.profilePicture);
        setPreImage(usr.profilePicture);
    }, [currentUser.followings, usr]);

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    usr.profilePicture = file;
    
    setSelectedImage(file);
    setPreImage(URL.createObjectURL(file));
  };

  const handleDescription = (e) => {
    setBio(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handleCountry = (e) => {
    setCountry(e.target.value);
    console.log("country value");
    console.log(country);
  };

  const handleRelationship = (e) => {
    setRelationship(e.target.value);
  };

  const handleUploadFromGallery = () => {
    //console.log("handleUploadFromGallery");
    document.getElementById('fileSeleID').innerHTML = "Select from Gallery";
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Allow only image files
    input.onchange = (e) => {
      document.getElementById('fileSeleID').innerHTML = "File is selected!";
      const file = e.target.files[0];
      // Validate file type if needed
      //console.log('Selected image:', file);
      //console.log("selected file");
      //console.log(file);
      setSelectedImage(file);
      //usr.profilePicture = file;
      ////<input accept="image/*" type="file" onChange={handleImageInputChange} style={{ display: 'none' }} />
      setPreImage(URL.createObjectURL(file));
    };
    input.click();
  };

  /*const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${usr._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: usr._id });
      } else {
        await axios.put(`/users/${usr._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: usr._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };*/

  const handleUpload = async () => {
    console.log("handleUpload");
    // Handle the selected image and perform upload logic
    
      // Implement your upload logic here (e.g., send the image to the server)
      //console.log('Selected image:', selectedImage);
      //YourComponent.addToast('Your message here', { appearance: 'success' });
      //YourComponent.showToast('Saved Successfully');
      const profData = {
        userId: usr._id,
        desc: bio,
        city: city,
        from: country,
        relationship: relationship,
      };

      const formData = new FormData();
      formData.append('id', usr._id);
      formData.append('desc', bio);
      formData.append('city', city);
      formData.append('relationship', relationship);
      formData.append('from', country);

      const token = localStorage.getItem('token');
      try {
        if (selectedImage != null) {
          console.log("selectedImage");
          console.log(selectedImage);
          formData.append('profilePicture', selectedImage);
          const res = await axios.put(`/users/${usr._id}/updateProfile`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'auth-token': token
            },
        });
        toast.success("Profile Saved")
        //YourComponent.showToast('Saved Successfully');
      } 
      else 
      {
        console.log(formData);
        const token = localStorage.getItem('token');
        const res = await axios.post(`/users/${usr._id}/updateProfile2`, profData, {headers: { 'auth-token': token }});
          //toast.success("Updated");
          //const { addToast } = useToasts();
          //YourComponent.showToast('Saved Successfully');
          toast.success({Profile_Saved});
          
      }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error({Failed_Update_profile});
        //YourComponent.showToast('Failed to upload the profile');
        // Handle error
      }
     // const fetchUser = async () => {
     //   const res = await axios.get(`/users?username=${username}`)
     //   setUsr(res.data);
    //};
    //fetchUser()
  };
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
                {/*username == currentUser.username && (
                <div className={classes.photosInfo}>
                  <button id="fileSeleID" onClick={handleUploadFromGallery}>{Select_from_Gallery}</button>
                  
                  <button onClick={handleUpload}>{Save_profile}</button>
                </div>
                )*/}
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
          <div className={classes.profileRightBottom} >
              <Feed username={username} selectedValue={"0"}/>
              {/* isMobileDevice && isTabletDevice && <Rightbar  user={usr} username={username}/>*/}
            </div>
        </div>
        </div>
      </>
    );
  }

export default withStyles(styles)(Profile);
