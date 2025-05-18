import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {styles} from './closeFriendStyle'
import { Link } from "react-router-dom";

function CloseFriend({user, classes}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <li className={classes.sidebarFriend}>
            <Link  style={{textDecoration: 'none'}} key={user._id} to={"/profile/" + user.username} className={classes.linkToFriendProfile}>
            <img src={user.profilePicture ? PF + user.profilePicture : PF+'person/noAvatar.png'} alt="" className={classes.sidebarFriendImg}/>
            </Link>
            <span className={classes.sidebarFriendName}>{user.username}</span>

        </li>
    )
}

export default withStyles(styles)(CloseFriend);