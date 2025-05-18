import React from 'react';
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Online from "../online/Online";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './sidebarStyle'

function Sidebar({ user, classes }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);

    useEffect(() => {
      const token = localStorage.getItem('token');
    const getFollowers = async () => {
      try {
        const friendList = await axios.get("/users/allUsers/" + currentUser._id,  {headers: { 'auth-token': token }});
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFollowers();
  }, [currentUser]);


    return (
        <div className={classes.sidebar}>
           <div className={classes.sidebarWrapper}>

                <h4 className={classes.rightbarTitle}>All Users</h4>

                <ul className={classes.sidebarFriendList}>
                    {friends.map((u) => (
                        u.isAdmin == true? null :<Online key={u.id} user={u} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default withStyles(styles)(Sidebar);
