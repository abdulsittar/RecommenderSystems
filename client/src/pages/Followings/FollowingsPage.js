import React from 'react';
import {useContext, useState, useEffect, useRef} from 'react';
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import {styles} from './followingsPageStyle';
import { useMediaQuery } from 'react-responsive';
import {COLORS} from '../../components/values/colors.js';
//import User from '../../../../server/models/User';
import TimeMe from "timeme.js";

function FollowingsPage({ username, classes }) {
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
    const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
    const [shouldSendEvent, setShouldSendEvent] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
        const getFriends = async () => {
          try {
            const friendList = await axios.get("/users/allUsers/" + currentUser._id, {headers: { 'auth-token': token }});
            setFriends(friendList.data);
          } catch (err) {
            console.log(err);
          }
        };
        getFriends();
      }, [currentUser]);

     /* useEffect(() => {
        TimeMe.initialize({
          currentPageName: "FollowingsPage", // current page
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
        <Topbar isProfile="true"/>
        <div className={classes.followingPageTop} style={{'backgroundColor': COLORS.backgroudColor}}>
           <div className={classes.followingPageWrapper}>
        <h4 className={classes.rightbarTitle}>FOLLOWINGS</h4>
        <div className={classes.rightbarFollowings}>
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              className={classes.linkToFriendProfile}
            >
              <div className={classes.rightbarFollowing}>
                <img
                  src={friend.profilePicture? PF + friend.profilePicture: PF+'person/noAvatar.png'
                  }
                  alt=""
                  className={classes.rightbarFollowingImg}
                />
                <span className={classes.rightbarFollowingName}>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
        </div>
        </div>
      </>
    )
}

export default withStyles(styles)(FollowingsPage);
