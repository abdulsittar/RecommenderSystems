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

    const logOut = () => {
        console.log('🚪 Logging out, redirecting to thank you page');
        console.log('Current user:', currentUser);
        
        // Get the yourID string from the uniqueId object
        const uniqueIdString = currentUser?.uniqueId?.yourID || 'default';
        console.log('Using uniqueId string:', uniqueIdString);
        
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        const thankYouPath = `/thankyou/${uniqueIdString}`;
        console.log('Redirecting to:', thankYouPath);
        history.push(thankYouPath);
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
            
            if (articlesRead < 3) {
                // Show warning dialog with updated count
                setShowWarningDialog(true);
            } else {
                // Allow logout
                logOut();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to cached data if API fails
            const articlesRead = currentUser?.sessionReadPosts?.length || 0;
            setArticlesReadCount(articlesRead);
            if (articlesRead < 3) {
                setShowWarningDialog(true);
            } else {
                logOut();
            }
        }
    }

    const handleWarningClose = () => {
        setShowWarningDialog(false);
    }

    const handleForceLogout = () => {
        setShowWarningDialog(false);
        logOut();
    }

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
                    {"Minimum 3 Articles Required"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="warning-dialog-description">
                        Please read at least 3 articles before ending your session. 
                        You have currently read {articlesReadCount} article(s).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleWarningClose} color="primary">
                        Continue Reading
                    </Button>
                    <Button onClick={handleForceLogout} color="secondary">
                        End Anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default withStyles(styles)(Topbar);