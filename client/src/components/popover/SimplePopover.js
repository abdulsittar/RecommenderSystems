import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Avatar from '../avatar/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { Link } from 'react-router-dom'; 
import { useHistory } from "react-router";
import { useMediaQuery } from 'react-responsive';
import { Profile_details, Log_Out, Time_Spent } from '../../constants';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	typography: {
		width: '200px',
		paddingRight: '40px',
	},
	desc: {
		color: '#gray',
		fontSize: '14px'
	},
	flex: {
		display: 'flex',
		padding: theme.spacing(2),
		alignItems: 'center',
		justifyContent: 'space-between',
		transition: 'all .3s ease',
		margin: '5px 10px',
		borderRadius: '5px',
		cursor: 'pointer',
		paddingRight: '40px',
		'&:hover': {
			background: '#ccc',

		}
	},
	icon: {
		marginLeft: '10px'
	}
}));

export default function SimplePopover({anchorEl, handleClose}) {
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
  const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const logOut = () => {
	localStorage.removeItem("user");
	localStorage.removeItem("token");
	const urlParts = window.location.pathname.split('/');
    const valu = urlParts[urlParts.length-1]
	history.push(`/register/${valu}`);
  }

  const handleEndSession = () => {
    const articlesRead = user?.readPosts?.length || 0;
    console.log('End session clicked. Articles read:', articlesRead);
    
    if (articlesRead < 3) {
      // Show warning dialog
      setShowWarningDialog(true);
    } else {
      // Allow logout
      logOut();
    }
  }

  const handleWarningClose = () => {
    setShowWarningDialog(false);
    handleClose();
  }

  const handleForceLogout = () => {
    setShowWarningDialog(false);
    logOut();
  }

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
		
      >
		{/*<div className={classes.flex}>
			<Avatar/>
			<Link to={`/profile/${user.username}`} style={{textDecoration:'none', color: '#111', cursor:"default"}}>
				<Typography className={classes.typography}>{user.username} </Typography>
				<Typography className={classes.typography + ' ' + classes.desc}>{Profile_details}</Typography>
			</Link>
		</div>
		 (!isMobileDevice || !isTabletDevice)?  
		<div>
		<div className={classes.flex}>
			<Avatar/>
			<Link to={`/followingspage/${"Followings"}`} style={{textDecoration:'none', color: '#111'}}>
				<Typography className={classes.typography + ' ' + classes.desc}>Followings</Typography>
			</Link>
		</div>
		<div className={classes.flex}>
			<Avatar/>
			<Link to={`/followerspage/${"Followers"}`} style={{textDecoration:'none', color: '#111'}}>
				<Typography className={classes.typography + ' ' + classes.desc}>Followers</Typography>
			</Link>
		</div>
		</div>: <div></div>
		
		<div className={classes.flex}>
			<ExitToAppIcon className={classes.icon} />
			<Typography className={classes.typography} onClick={logOut}>{Log_Out}</Typography>
		</div>
		
		<div className={classes.flex}>
			<Avatar/>
			<Link to={`/progress/${user.username}`} style={{textDecoration:'none', color: '#111'}}>
				<Typography className={classes.typography}>{"Befragung"} </Typography>
				<Typography className={classes.typography + ' ' + classes.desc}>{Time_Spent}</Typography>
			</Link>
		</div>
	*/}
		
		<div className={classes.flex} onClick={handleEndSession}>
			<PowerSettingsNewIcon className={classes.icon} />
			<Typography className={classes.typography}>End Session</Typography>
		</div>
		
      </Popover>

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
            You have currently read {user?.readPosts?.length || 0} article(s).
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
  );
}