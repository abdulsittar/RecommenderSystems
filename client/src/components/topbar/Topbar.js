import React from 'react';
import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import RefreshIcon  from '@mui/icons-material/Refresh';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import {COLORS} from '../values/colors.js';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { withStyles } from '@material-ui/core/styles';
import { styles } from './topbarStyle';
import { useMediaQuery } from 'react-responsive';
import HomeIcon from '@mui/icons-material/Home';
import {Searche } from '../../constants';
import { toast } from 'react-toastify';
import { useHistory } from "react-router";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SimplePopover from '../popover/SimplePopover';

function Topbar({ classes, setSelectedValue, isProfile, setSearchTerm, onAction, showRefreshIcon, onAction2 }) {
    const [fv, setFv] = useState(0);
    const { user }    = useContext(AuthContext);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const PF          = process.env.REACT_APP_PUBLIC_FOLDER;
    const [anchorEl, setAnchorEl] = useState(null);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [articlesReadCount, setArticlesReadCount] = useState(0);
    const history = useHistory();
    
    const shouldShowRefresh = showRefreshIcon || false;
    
    useEffect(() => {
        //console.log("is Profile value");
        //console.log(isProfile);
      }, []);

    const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
    const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
    const isLaptop       = useMediaQuery({ query: "(min-device-width: 1024px)", });
    const isDesktop      = useMediaQuery({ query: "(min-device-width: 1200px)", });
    const isBigScreen    = useMediaQuery({ query: "(min-device-width: 1201px )", });

    const timeLineClick = (event) => {
        //console.log('Clicked ' + event.currentTarget)
    };

    const openProfileDetails = (event) => {
        //console.log('Clicked ' + event.currentTarget)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logOut = async () => {
        try {
            console.log('🚪 Ending session, checking if post-survey should be shown');
            console.log('Current user:', currentUser);
            
            if (!currentUser || !currentUser._id) {
                console.error('❌ currentUser or currentUser._id is missing!');
                return;
            }
            
            // Fetch fresh user data to get populated uniqueId
            const token = localStorage.getItem('token');
            const userRes = await axios.get(`/users/${currentUser._id}`, {
                headers: { 'auth-token': token }
            });
            const freshUser = userRes.data;
            console.log('📥 Fetched fresh user data:', freshUser);
            
            console.log('Current user ID:', currentUser._id);
            // Use user-specific session count key
            const sessionCountKey = `sessionCount_${currentUser._id}`;
            console.log('Current sessionCount from localStorage:', localStorage.getItem(sessionCountKey));
            
            // Get the yourID string from the uniqueId object
            console.log('Full uniqueId object:', freshUser.uniqueId);
            console.log('uniqueId._id:', freshUser.uniqueId?._id);
            console.log('uniqueId.yourID:', freshUser.uniqueId?.yourID);
            
            // Try to extract the unique ID - handle both populated and unpopulated cases
            let uniqueIdString = 'default';
            if (freshUser.uniqueId?.yourID) {
                uniqueIdString = freshUser.uniqueId.yourID;
            } else if (freshUser.uniqueId?._id) {
                uniqueIdString = freshUser.uniqueId._id;
            } else if (typeof freshUser.uniqueId === 'string') {
                uniqueIdString = freshUser.uniqueId;
            }
            console.log('Extracted uniqueId string:', uniqueIdString);
            
            // PILOT STUDY: Check if user should see post-survey
            try {
                const token = localStorage.getItem('token');
                // Get current session count and send to server
                const currentSessionCount = parseInt(localStorage.getItem(sessionCountKey) || '1');
                console.log('📊 Current session count:', currentSessionCount);
                
                const url = `/users/${currentUser._id}/getUserActions?sessionCount=${currentSessionCount}`;
                console.log('Calling getUserActions at:', url);
                
                const response = await axios.get(url, {
                    headers: { 'auth-token': token }
                });
                
                console.log('✅ getUserActions response:', response.data);
                const showAlert = response.data?.showAlert;
                console.log('showAlert value:', showAlert);
                
                if (showAlert === 'third' || showAlert === 'final') {
                    // User completed 2 sessions - redirect to post-survey
                    console.log('🎯 Post-survey trigger detected! showAlert:', showAlert);
                    console.log('Redirecting to /postsurvey-pilot');
                    // Clear session-specific data but keep user logged in for post-survey
                    const recurringSessionKey = `isRecurringSession_${currentUser._id}`;
                    localStorage.removeItem(recurringSessionKey);
                    localStorage.removeItem(sessionCountKey); // Remove user-specific session count
                    history.push('/postsurvey-pilot');
                    return;
                }
                
                console.log('ℹ️ Not ready for post-survey yet. showAlert:', showAlert);
            } catch (error) {
                console.error('❌ Error checking getUserActions:', error);
                console.error('Error details:', error.response?.data || error.message);
                console.error('Status code:', error.response?.status);
            }
            
            // Not ready for post-survey yet - show thank you page
            // PILOT STUDY: Log out user so sessionReadPosts gets cleared
            // They'll auto-login on next session via unique link
            console.log('🚪 Logging out user - sessionReadPosts will be cleared on next login');
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            
            // Clear user-specific session flag
            const recurringSessionKey = `isRecurringSession_${currentUser._id}`;
            localStorage.removeItem(recurringSessionKey);
            
            const thankYouPath = `/thankyou/${uniqueIdString}`;
            console.log('Redirecting to:', thankYouPath);
            history.push(thankYouPath);
        } catch (outerError) {
            console.error('❌ FATAL ERROR in logOut function:', outerError);
            console.error('Stack trace:', outerError.stack);
        }
    }

    const handleEndSession = async () => {
        try {
            // Fetch the latest user data to get updated readPosts count
            const token = localStorage.getItem('token');
            const res = await axios.get(`/users/${currentUser._id}`, {
                headers: { 'auth-token': token }
            });
            
            const articlesRead = res.data?.sessionReadPosts?.length || 0;
            setArticlesReadCount(articlesRead);
            console.log('End session clicked. Articles read in this session:', articlesRead);
            
            if (articlesRead < 5) {
                // Show warning dialog with updated count
                setShowWarningDialog(true);
            } else {
                // Allow logout
                await logOut();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to cached data if API fails
            const articlesRead = currentUser?.sessionReadPosts?.length || 0;
            setArticlesReadCount(articlesRead);
            if (articlesRead < 5) {
                setShowWarningDialog(true);
            } else {
                await logOut();
            }
        }
    }

    const handleWarningClose = () => {
        setShowWarningDialog(false);
    }

    // PILOT STUDY: Removed handleForceLogout function - no force logout allowed
    // MAIN STUDY: Uncomment if you want to restore the "End Anyway" button
    // const handleForceLogout = () => {
    //     setShowWarningDialog(false);
    //     logOut();
    // }

    function setSearchTermFunction(value) {
        setSearchTerm(value);
    }

const handleRefreshFeed23 = (e) => {
    e.preventDefault();
    //const email = document.getElementById('email').value;
    //const password = document.getElementById('password').value;
    //const username =  usrname;

    //if (email == password) {
    //	setPasswordErr("Check you password and email again!");
    //}
    //loginCall({ username: username, password: password }, dispatch);
    //if(error == true){
    //    setPasswordErr("Check you password and email again!");
    //}
    //console.log(error);
    //if(error == false){history.push("/");}
    
  };


    const onRadioChanged = e => {
        //console.log("radio avlues")
        //console.log(e.target.value)
        setSelectedValue(e.target.value)
        //setUpdatedPosts(e.target.value)
        //try {
        //    console.log("radio avlues")
        //dispatch({ type: "RADIO", payload: e.target.value });
        //this.props.fetchPosts(e.target.value)
        //} catch (err) {
        //    console.log(err)
        //}<div className={classes.searchbar}>
        //<Search className={classes.searchIcon} />
        //<input placeholder="Search" className={classes.searchInput} />
    //</div>

    //<div className={classes.topbarCenter} style={{ 'backgroundColor': '#3e3f40', 'margin-top': (isMobileDevice || isTabletDevice) && '20px', 'display':  !isMobileDevice && !isTabletDevice && 'flex'}}  >
    // </div>
    // (isMobileDevice || isTabletDevice) &&
    };

    return (
        <div className={classes.topbarContainer} style={{ 'backgroundColor': COLORS.backgroudColor, 'display': (isMobileDevice || isTabletDevice) && 'flex' , 'height': isProfile && '40px' }}>
            
            <div className={classes.topbarLeft} style={{'width' : window.innerWidth, justifyContent: 'space-between'}}>

            <div style={{ alignItems: 'flex-start'}}>
                <Link  style={{textDecoration: 'none'}} to='/'  className={classes.titleAndIcon}>
                    <HomeIcon className={classes.homeIcon} sx={{ color: COLORS.homeIconColor}} style={{'margin-top': !isMobileDevice && !isTabletDevice && '10px' }}/>
                    {!isMobileDevice && !isTabletDevice && <span className={classes.logo} style={{'margin-top': !isMobileDevice && !isTabletDevice && '10px' }}>TWON</span>}
                    {isMobileDevice && isTabletDevice && <span className={classes.logo}>TWON</span>}
                </Link>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            {/*shouldShowRefresh && (
            <button className={classes.button} onClick={onAction}>
                <RefreshIcon style={{ marginRight: '5px' }} />
                Next Page
            </button>
        )}
        {shouldShowRefresh && (
        <button className={classes.button} onClick={onAction2}>
            <QuestionMarkIcon style={{ marginRight: '5px' }} />
            Informacije o zadatku
            </button>
        )*/}
        
    </div>

            {
            !isMobileDevice && !isTabletDevice && 
            <div style={{'display': 'flex', alignItems: 'flex-end', 'margin': '5px 15px'}}>
                     <Button 
                        variant="contained"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={handleEndSession}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            padding: '8px 20px',
                            '&:hover': {
                                backgroundColor: '#c82333'
                            }
                        }}
                     >
                        End Session
                     </Button>
            </div>
            }
            </div>

            {
            !isProfile?
            <div className={classes.topbarCenter} style={{ 'backgroundColor': COLORS.backgroudColor, 'margin-top': (isMobileDevice || isTabletDevice) && '0px', 'display':  !isMobileDevice && !isTabletDevice && 'flex'}}  >
                {/*<div className={classes.searchbar}>
                    <Search className={classes.searchIcon} />
                    <input placeholder={Searche} className={classes.searchInput} onChange={(event) => { setSearchTermFunction(event.target.value);}}/>
                </div>*/}
            </div>: <div></div>
            }

            {
            /*!isProfile?
            {<div className={classes.topbarRight} style={{ 'margin-top': '-10px', 'backgroundColor': COLORS.backgroudColor, 'margin-top': '0px', 'display':  'flex', 'flex':  '4', 'flex-direction':  'row' }}>
                <FormControl row={true} style={{ 'margin-left': '0', "fontSize": "10px" }}>
                    <FormLabel id="demo-radio-buttons-group-label" style={{ text: 'white', 'margin': '0' }}></FormLabel>
                    <RadioGroup style={{ 'margin': '0', "fontSize": "10px" }} aria-labelledby="demo-radio-buttons-group-label" defaultValue="0" row={true} name="radio-buttons-group" onChange={onRadioChanged}>
                        <FormControlLabel value="0" control={<Radio />} label={<span style={{ "fontSize": !isMobileDevice && !isTabletDevice && "12px"}}>{"Recommended"}</span>} />
                        <FormControlLabel value="1" control={<Radio />} label={<span style={{ "fontSize": !isMobileDevice && !isTabletDevice && "12px"}}>{"Followers"}</span>} />
                        <FormControlLabel value="2" control={<Radio />} label={<span style={{ "fontSize": !isMobileDevice && !isTabletDevice && "12px"}}>{"Followings"}</span>} />
                    </RadioGroup>
            </FormControl>}
            </div> : <div></div>to={`/profile/${user.username}`} to={`/profile/${user.username}`} 
            */
            }
            {(isMobileDevice || isTabletDevice) && 
            <div className={classes.topbarRight} >
                <div className={classes.userInfo} style={{ alignItems: 'flex-end' }}>
                     <Button 
                        variant="contained"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={handleEndSession}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            padding: '6px 16px',
                            fontSize: '14px'
                        }}
                     >
                        End Session
                     </Button>
                </div>
            </div>}

            {/* Warning Dialog */}
            <Dialog
                open={showWarningDialog}
                onClose={handleWarningClose}
                aria-labelledby="warning-dialog-title"
                aria-describedby="warning-dialog-description"
            >
                <DialogTitle id="warning-dialog-title">
                    {"Minimum 5 Articles Required"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="warning-dialog-description">
                        Please read at least 5 articles before ending your session. 
                        You have currently read {articlesReadCount} article(s). 
                        You need to read {5 - articlesReadCount} more article(s).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleWarningClose} color="primary" autoFocus>
                        Continue Reading
                    </Button>
                    {/* PILOT STUDY: Removed "End Anyway" button - users must read 5 articles */}
                    {/* MAIN STUDY: Uncomment below to restore force logout option */}
                    {/* <Button onClick={handleForceLogout} color="secondary">
                        End Anyway
                    </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default withStyles(styles)(Topbar);