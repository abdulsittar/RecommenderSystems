import React from 'react';
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './rightbarStyle'

function Rightbar2({ classes }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/followers/" + currentUser._id, {headers: { 'auth-token': token }});
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [currentUser]);

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarWrapper}>
      <h4 className={classes.rightbarTitle}>Followers</h4>
        <ul className={classes.rightbarFriendList}>
          {friends.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withStyles(styles)(Rightbar2);