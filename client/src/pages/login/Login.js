import React from 'react';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import {loginCall} from '../../apiCalls';
import { useHistory } from "react-router";
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './loginPageStyle';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import TimeMe from "timeme.js";
import axios from "axios";
import { useParams } from 'react-router';
import { disclaim} from '../../constants';


function Login({ classes }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user, isFetching, error, dispatch} = useContext(AuthContext);
  const history = useHistory();
  const {state} = useLocation();
  const [uniqId, setUniqId] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [shouldSendEvent, setShouldSendEvent] = useState(false);
  const t = new Date().getTime();
  console.log(TimeMe.getTimeOnCurrentPageInSeconds());
  const userId = useParams().userId;
  const [profPic, setProfPic] = useState("");

  const [usrname, setUsrname] = useState("");

  /*useEffect(() => {
	TimeMe.initialize({
		currentPageName: "Login", // current page
		idleTimeoutInSeconds: 15 // seconds
	  });

	  TimeMe.callWhenUserLeaves(() => {
		setShouldSendEvent(true);
	  });
  
	  TimeMe.callWhenUserReturns(() => {
		setShouldSendEvent(false);
	  });

  }, []); */

  const handleClick = (e) => {
	e.preventDefault();
	//const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const username =  usrname;

	//if (email == password) {
	//	setPasswordErr("Check you password and email again!");
	//}
    loginCall({ username: username, password: password }, dispatch);
	if(error == true){
		setPasswordErr("Check you password and email again!");
	}
	//console.log(error);
	if(error == false){history.push("/");}
	
  };

  const getUser = async (uniqId) => {
	const token = localStorage.getItem('token');
	try {
		const res = await axios.post(`/users/getUser/${uniqId}`,{ headers: { 'auth-token': token }}); 
		console.log(res.data.login);
		console.log(res.data.user);
	
		if(res.data.login == true){
			const user3 = res.data.user;
			setProfPic(user3.profilePicture);
			setUsrname(user3.username);
		}
	  } catch (err) {
		console.log(err);  
	  }
	};

  useEffect(() => {
	console.log("id");
	console.log(userId);
	const urlParts = window.location.pathname.split('/');
    const valu = urlParts[urlParts.length-1]
    console.log(valu);
    setUniqId(userId);
	getUser(userId);

		}, []);

    return (
		  <div className={classes.login} >
				<form className={classes.form} noValidate autoComplete="off" onSubmit={handleClick}>
					<h1 className={classes.header}>Log In</h1>
					{ /*<p className={classes.text}>new to this app? <Link  style={{textDecoration: 'none'}} to={"/register/" + userId} >sign up for free</Link></p>*/ }
					<p className={classes.text}> </p>
					<p className={classes.disclaimor}>{disclaim}</p> 
					{ /*<TextField 
						className={classes.textField}						
						id='email' 
						name='email' 
						label="Email" 
						required 	
						type="email"
					/>*/ }
					{ /*<p className={classes.errorMessage}>err email</p>*/ }
					<div className={classes.label}><label ><span style={{"margin-left": "0.5rem", "margin-top": "0.5rem"}}><img width="50" height="50" className={classes.profileCoverImg}  src={profPic ? PF+profPic : PF+"person/noCover.png"} alt="" />{" "+ usrname}</span></label></div>
        
					<TextField
						className={classes.textField}
						id="password"
						label="Password"
						type="password"
						//autoComplete="current-password"
						required
						minLength="6"
					/>
					{ <p className={classes.errorMessage}>{passwordErr}</p>}
					<button type="submit" className={classes.button}>Log In</button>
				</form>
		</div>

    )
}

export default withStyles(styles)(Login);