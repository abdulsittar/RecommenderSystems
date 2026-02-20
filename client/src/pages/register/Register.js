// ====================================================================
// PILOT STUDY MODIFICATIONS - 2 Sessions
// ====================================================================
// This file has been modified for the pilot study which uses 2 sessions.
// For the main study with 3 sessions, search for "PILOT STUDY" and
// "MAIN STUDY" comments throughout this file and uncomment the main
// study code while commenting out pilot study code.
// Key changes:
// - Procedure section text changed from "four weeks" to "two weeks"
// - References to multi-week study period updated for 2 sessions
// ====================================================================

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './registerPageStyle'
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { render } from "react-dom";
import axios from "axios";
import TimeMe from "timeme.js";
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import LoadingBar from "react-top-loading-bar";

import { Buffer } from 'buffer';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify'; 
import { useScrollBy } from "react-use-window-scroll";
import {  AlertDialog,  AlertDialogLabel,  AlertDialogDescription,  AlertDialogOverlay,  AlertDialogContent,} from "@reach/alert-dialog";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';

import {
  // New constants for three-stage survey
  CONSENT_WELCOME,
  CONSENT_INTRODUCTION,
  CONSENT_STUDY_TITLE,
  CONSENT_RESEARCHERS,
  CONSENT_PURPOSE_TITLE,
  CONSENT_PURPOSE,
  CONSENT_PROCEDURE_TITLE,
  CONSENT_PROCEDURE,
  CONSENT_REQUIREMENTS_TITLE,
  CONSENT_REQUIREMENTS,
  CONSENT_TIME_TITLE,
  CONSENT_TIME,
  CONSENT_VOLUNTARY_TITLE,
  CONSENT_VOLUNTARY,
  CONSENT_DATA_PROTECTION_TITLE,
  CONSENT_DATA_PROTECTION,
  CONSENT_DATA_SHARING_TITLE,
  CONSENT_DATA_SHARING,
  CONSENT_CONTACT_TITLE,
  CONSENT_CONTACT,
  CONSENT_COMPLAINTS_TITLE,
  CONSENT_COMPLAINTS,
  CONSENT_QUESTIONS,
  CONSENT_AGREE,
  CONSENT_DISAGREE,
  ONETIME_INTRO,
  // Demographics Q1
  DEMO_AGE_QUESTION,
  DEMO_AGE_OPTIONS,
  DEMO_GENDER_QUESTION,
  DEMO_GENDER_OPTIONS,
  DEMO_EDUCATION_QUESTION,
  DEMO_EDUCATION_OPTIONS,
  DEMO_EMPLOYMENT_QUESTION,
  DEMO_EMPLOYMENT_OPTIONS,
  // Civil engagement Q2
  CIVIL_ENGAGEMENT_INTRO,
  CIVIL_VOTED_QUESTION,
  CIVIL_VOTED_OPTIONS,
  CIVIL_ACTIVITIES_QUESTION,
  CIVIL_ACTIVITIES_OPTIONS,
  CIVIL_MEMBER_QUESTION,
  CIVIL_MEMBER_OPTIONS,
  // News consumption Q3
  NEWS_CONSUMPTION_INTRO,
  NEWS_FREQUENCY_QUESTION,
  NEWS_FREQUENCY_OPTIONS,
  NEWS_FREQUENCY2_QUESTION,
  NEWS_SOURCE_QUESTION,
  NEWS_SOURCE_OPTIONS,
  BTN_NEXT,
  BTN_PREVIOUS,
  BTN_SUBMIT,
  BTN_CONTINUE,
  PROGRESS_CONSENT,
  PROGRESS_DEMOGRAPHICS,
  ERROR_REQUIRED_FIELD,
  ERROR_INVALID_AGE,
  ERROR_NETWORK,
  SUCCESS_CONSENT,
  SUCCESS_DEMOGRAPHICS,
  // Legacy constants
  followers,
  followings,
  email,
  Password,
  Send,
  comments,
  Write_something,
  A_user_with,
} from '../../constants_STA';
import { Unstable_Grid2 } from '@mui/material';

function Register({classes}) {
  const history = useHistory();
  const scrollBy = useScrollBy();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const {user, isFetching, error, dispatch} = useContext(AuthContext);
  
  // Core survey state
  const [currentStage, setCurrentStage] = useState('consent'); // 'consent', 'demographics'
  const [uniqId, setUniqId] = useState('');
  
  // Form data state
  const [consentAnswers, setConsentAnswers] = useState({});
  const [demographicsData, setDemographicsData] = useState({
    newsSource: [] // Initialize as empty array for multi-select
  });
  
  // UI state
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const cancelRef = React.useRef();
  
  const [checkingStatus, setCheckingStatus] = useState(true);

  // User account state (keep these for account creation flow)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [proPic, setProPic] = useState("");
  
  // User selection removed - auto-registration after survey completion
  
  const initialized = useRef(false);

  useEffect(() => {
      // Extract unique ID from URL
    const urlParts = window.location.pathname.split('/');
    const uniqueId = urlParts[urlParts.length-1];
    setUniqId(uniqueId);
  

  
  const checkUserSurveyStatus = async () => {
    try {
      const res = await axios.post(`/presurvey/isSubmitted/${uniqId}`);
      const data = res.data;

      // If user already exists (has completed registration before), auto-login instead of redirecting to login page
      if (data.login === true) {
        toast.info('Welcome back!');
        console.log('User already exists, auto-logging in...');
        
        // Auto-login using the unique ID and password (first 10 characters of unique ID)
        const password = uniqId.substring(0, 10);
        const username = data.user.username;
        
        try {
          const loginResponse = await loginCall({ 
            username: username, 
            password: password,
            uniqueId: uniqId
          }, dispatch);
          
          console.log('Login response received:', loginResponse);
          
          // Check if this is a recurring session
          if (loginResponse && loginResponse.isRecurringSession) {
            console.log('✅ Recurring session detected!');
            console.log('   Server sessionCount:', loginResponse.sessionCount);
            console.log('   User ID:', data.user._id);
            
            // Store user-specific session info in localStorage to show welcome message
            const recurringSessionKey = `isRecurringSession_${data.user._id}`;
            const sessionCountKey = `sessionCount_${data.user._id}`;
            
            console.log('   Before setting - localStorage sessionCount:', localStorage.getItem(sessionCountKey));
            localStorage.setItem(recurringSessionKey, 'true');
            localStorage.setItem(sessionCountKey, String(loginResponse.sessionCount));
            console.log('   After setting - localStorage sessionCount:', localStorage.getItem(sessionCountKey));
            console.log(`   ✓ Set localStorage flags - isRecurringSession: true, sessionCount:`, loginResponse.sessionCount);
          } else {
            console.log('Not a recurring session. isRecurringSession:', loginResponse?.isRecurringSession, 'sessionCount:', loginResponse?.sessionCount);
            // Initialize session count for first-time users with user-specific key
            const sessionCountKey = `sessionCount_${data.user._id}`;
            if (!localStorage.getItem(sessionCountKey)) {
              localStorage.setItem(sessionCountKey, '1');
              console.log(`Initialized sessionCount to 1 for new user ${data.user._id}`);
            }
          }
          
          console.log('Redirecting to home...');
          history.push("/");
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          toast.error('Login failed. Please try again.');
          // If auto-login fails, fall back to manual login page
          history.push(`/login/${uniqId}`);
        }
        return;
      }
      
      // Otherwise, this is a new user - start with consent stage
      // No need to check for weekly survey on first registration
    } catch (error) {
      console.error("Error checking submission status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  checkUserSurveyStatus(uniqueId);
}, [uniqId, history]);

  // Helper functions
  const getRandomNumber = () => Math.floor(Math.random() * 4) + 1;

  // Animation keyframes
  const fadeInOut = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  
  const fadeOut = keyframes`
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  `;
  
  // Styled component with dynamic animation
  const AnimatedDiv = styled.div`
    &.fade-enter {
      animation: ${fadeInOut} 1s forwards;
    }
    &.fade-exit {
      animation: ${fadeOut} 1s forwards;
    }
  `;
    
  const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;

  const slideOut = keyframes`
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-100%);
    }
  `;

  const SlideDiv = styled.div`
    &.slide-enter {
      animation: ${slideIn} 1s forwards;
      opacity: 0;
    }
    &.slide-enter-active {
      animation: ${slideIn} 1s forwards;
      opacity: 1;
    }
    &.slide-exit {
      animation: ${slideOut} 1s forwards;
      opacity: 1;
    }
    &.slide-exit-active {
      animation: ${slideOut} 1s forwards;
      opacity: 0;
    }
  `;
    
  // Handler functions for three-stage survey
  const handleConsentSubmit = async () => {
    const uncheckedQuestions = CONSENT_QUESTIONS.map((_, index) => index).filter(index => !consentAnswers[index]);
    
    if (uncheckedQuestions.length === 0) {
      try {
        setButtonDisabled(true);
        
        // Convert object to array for API call
        const consentAnswersArray = CONSENT_QUESTIONS.map((_, index) => Boolean(consentAnswers[index]));
        
        // Make API call to save consent data
        const response = await axios.post(`/presurvey/consent/${uniqId}`, {
          consentAnswers: consentAnswersArray,
          agreedToParticipate: consentAnswersArray.every(answer => answer === true)
        });
        
        if (response.status === 200) {
          console.log('Consent saved successfully:', response.data);
          setCurrentStage('demographics');
          toast.success('Consent form completed successfully!');
          // Scroll to top of page for next stage
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
          throw new Error('Failed to save consent data');
        }
      } catch (error) {
        console.error('Error saving consent data:', error);
        toast.error('Error saving consent form. Please try again.');
      } finally {
        setButtonDisabled(false);
      }
    } else {
      toast.error(`Please check the consent box to continue.`);
      
      // Scroll to first unchecked item
      const firstUnchecked = document.querySelector(`[data-consent-index="${uncheckedQuestions[0]}"]`);
      if (firstUnchecked) {
        firstUnchecked.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleDemographicsSubmit = async () => {
    // Validate all required demographic fields
    const requiredFields = [
      'age', 'gender', 'education', 'employment',
      'voted', 'politicalActivities', 'partyMember',
      'newsFrequency', 'newsFrequency2'
    ];
    
    const missingFields = requiredFields.filter(field => !demographicsData[field]);
    
    // Check that at least one news source is selected
    if (!demographicsData.newsSource || demographicsData.newsSource.length === 0) {
      alert('Please select at least one news source');
      return;
    }
    
    if (missingFields.length === 0) {
      try {
        setButtonDisabled(true);
        
        // Prepare demographics data for API call
        const demographicsPayload = {
          age: demographicsData.age,
          gender: demographicsData.gender,
          education: demographicsData.education,
          employment: demographicsData.employment,
          hasVoted: demographicsData.voted,
          politicalActivities: demographicsData.politicalActivities,
          politicalMember: demographicsData.partyMember,
          newsFrequency: demographicsData.newsFrequency,
          newsFrequency2: demographicsData.newsFrequency2,
          newsSource: demographicsData.newsSource
        };
        
        // Make API call to save demographics data
        const response = await axios.post(`/presurvey/demographics/${uniqId}`, demographicsPayload);
        
        if (response.status === 200) {
          console.log('Demographics saved successfully:', response.data);
          toast.success('Survey completed! Creating your account...');
          // Scroll to top of page
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          // Automatically create user account and login
          await autoCreateAndLogin();
        } else {
          throw new Error('Failed to save demographics data');
        }
      } catch (error) {
        console.error('Error saving demographics data:', error);
        toast.error('Error saving demographics information. Please try again.');
      } finally {
        setButtonDisabled(false);
      }
    } else {
      toast.error(`Please complete all required fields. Missing: ${missingFields.length} field(s)`);
    }
  };

  // Weekly survey removed from registration flow - now appears as popup in home page
  
  const autoCreateAndLogin = async () => {
    try {
      console.log('Auto-creating user account for uniqId:', uniqId);
      
      // Check if user already exists and should auto-login instead
      const checkRes = await axios.post(`/presurvey/isSubmitted/${uniqId}`);
      console.log('Checking if user exists:', checkRes.data);
      
      if (checkRes.data.login === true) {
        console.log('User already exists, auto-logging in...');
        toast.info('Logging you in...');
        
        // Auto-login using the unique ID and password
        const password = uniqId.substring(0, 10);
        const username = checkRes.data.user.username;
        
        try {
          const loginResponse = await loginCall({ 
            username: username, 
            password: password,
            uniqueId: uniqId
          }, dispatch);
          
          // Check if this is a recurring session
          if (loginResponse && loginResponse.isRecurringSession) {
            console.log('Recurring session detected, session count:', loginResponse.sessionCount);
            // Store user-specific session info in localStorage to show welcome message
            const recurringSessionKey = `isRecurringSession_${checkRes.data.user._id}`;
            localStorage.setItem(recurringSessionKey, 'true');
            // Use user-specific sessionCount key
            const sessionCountKey = `sessionCount_${checkRes.data.user._id}`;
            localStorage.setItem(sessionCountKey, String(loginResponse.sessionCount));
            console.log(`Set localStorage flags for user ${checkRes.data.user._id} - isRecurringSession: true, sessionCount:`, loginResponse.sessionCount);
          } else {
            console.log('Not a recurring session - first time user');
          }
          
          console.log('Redirecting to home...');
          history.push("/");
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          toast.error('Login failed. Please try again.');
          history.push(`/login/${uniqId}`);
        }
        return;
      }
      
      // Create a fixed user profile (no selection needed)
      // Generate a simple username from the unique ID
      const username = `user_${uniqId.substring(0, 8)}`;
      const password = uniqId.substring(0, 10);
      
      // Use a default profile picture
      const profilePicture = "person/1.jpeg";
      
      const user = {
        ...demographicsData, // Include demographic data
        username: username,
        password: password,
        username_second: username,
        profilePicture: profilePicture,
        pool: 1, // Default pool
        uniqId: uniqId
      };

      console.log('Creating user account:', username);
      
      // Register the user
      const userRes = await axios.post(`/auth/register/${uniqId}`, user);
      console.log('User registration response:', userRes);
      
      if (userRes.data) {
        // Try to login to get the auth token
        try {
          const loginRes = await axios.post(`/auth/login`, {
            username: username,
            password: password
          });
          
          if (loginRes.data && loginRes.data.token) {
            console.log('Login successful, got token');
            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));
            dispatch({ type: "LOGIN_SUCCESS", payload: loginRes.data.user });
            
            toast.success('Welcome! Redirecting to the app...');
            
            // Set flag to show weekly survey after first time topic selection
            localStorage.setItem('showWeeklySurvey', 'true');
            localStorage.setItem('weeklySurveyReason', 'firstTime');
            
            setTimeout(() => {
              console.log('Redirecting to homepage...');
              history.push('/');
            }, 2000);
          }
        } catch (loginError) {
          console.error('Login error after registration:', loginError);
          toast.error('Account created but login failed. Please try logging in manually.');
        }
      }
    } catch (error) {
      console.error('Auto-registration error:', error);
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message || error.response.status}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  // Functions fetchUserProfiles and submitNext removed - no longer needed for auto-registration

  const handlePreviousStage = () => {
    switch(currentStage) {
      case 'demographics':
        setCurrentStage('consent');
        break;
      default:
        break;
    }
    // Scroll to top of page when going to previous stage
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const MemoizedSlideDiv = React.memo(({ children }) => <SlideDiv>{children}</SlideDiv>);

  return (
    <div>
      <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
      
      {/* Show loading screen while checking if user already exists */}
      {checkingStatus ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: '20px'
        }}>
          <div style={{ fontSize: '48px' }}>🔄</div>
          <Typography variant="h5">Checking your session...</Typography>
          <Typography variant="body1" color="textSecondary">Please wait</Typography>
        </div>
      ) : (
      <div className={classes.register}>
        <form className={classes.form} noValidate autoComplete="off">
          
          {/* TODO: Replace with new three-stage survey JSX */}
          <div className={classes.wrapper}>
            <h1>Three-Stage Survey</h1>
            <p>Current Stage: {currentStage}</p>
            <p>Unique ID: {uniqId}</p>
            
            {currentStage === 'consent' && (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '32px', fontWeight: 'bold' }}>
                  Form for Conscious and Free Consent to Participate in the Study
                </Typography>
                
                {/* Lead Researcher Info */}
                <Paper elevation={1} style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body2" style={{ marginBottom: '4px' }}>
                    <strong>Lead researcher:</strong> Uroš Sergaš
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '4px' }}>
                    <strong>Supervisors:</strong> Dr. Marko Tkalčič and Dr. Bruce Ferwerda
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '4px' }}>
                    <strong>Organisation:</strong> HICUP Lab, FAMNIT, University of Primorska
                  </Typography>
                  <Typography variant="body2">
                    <strong>Project:</strong> Diverse Perspectives in News Media: Analyzing User Engagement
                  </Typography>
                </Paper>

                {/* Consent form label */}
                <Typography variant="body1" style={{ fontWeight: 'bold', marginTop: '32px', marginBottom: '12px', fontSize: '18px' }}>
                  Consent Form
                </Typography>

                {/* Scrollable Full Consent Form */}
                <Paper 
                  elevation={3} 
                  style={{ 
                    marginTop: '0px', 
                    marginBottom: '32px',
                    border: '1px solid #757575',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ 
                    maxHeight: '350px', 
                    overflowY: 'auto',
                    padding: '24px',
                    border: '1px solid #e0e0e0',
                    borderTop: '1px solid #757575',
                    borderBottom: '1px solid #757575',
                    textAlign: 'justify'
                  }}>
                    <Typography variant="body1" paragraph style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '24px', marginTop: '0px', textAlign: 'justify' }}>
                      This form has two sections. The first provides information about the study, explains how your data will be processed and used, and what are your rights. Please read it carefully and if there is anything that might not be clear to you, feel free to contact us. The second section consists of a certificate of consent where you are asked to verify your agreement to participate by confirming 8 (eight) statements and signing the form.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      About the organisation
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', textAlign: 'justify' }}>
                      The study is organised by the HICUP Laboratory (https://hicup.famnit.upr.si/), a unit under the Department of Information Sciences and Technology of the Faculty of Mathematics, Natural Sciences and Information Technologies of the University of Primorska.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Purpose of the study
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      This study is aimed at exploring how individuals interact with news content in a digital environment. In particular, we are interested in understanding how people interact with articles with different views on a certain topic. By participating in this study, you will help us collect the data needed to address the aforementioned research interests.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Type of research intervention and participant selection
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You are invited to participate in this longitudinal study if you satisfy the given criteria:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Age:</strong> You must be at least 18 years old
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Consent:</strong> You must agree to and confirm the consent form
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Language proficiency:</strong> You must comprehend English
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Technological access:</strong> You own and are willing to use a smartphone or a computer with access to the internet to participate in the study
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Willingness for longer participation:</strong> You are willing to participate in a longitudinal study, that will span for multiple weeks and will require regular interactions with the study tool
                      </li>
                    </ul>

                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginTop: '16px' }}>
                      You can <strong>NOT</strong> participate in the study if any of the following holds for you:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Age:</strong> You are under 18 years old
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Legal restrictions:</strong> You live in a country where discussing or consuming certain political content might lead to legal consequences, compromising your safety
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Persons with cognitive or emotional support needs:</strong> This study involves exposure to news media items covering a range of topics, some of which may present viewpoints that differ from your own. You believe that engaging with such content could cause you psychological distress or discomfort
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '8px' }}>
                        <strong>Persons with insight information:</strong> You are working or studying in the news media sector or are conducting research on news media
                      </li>
                    </ul>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Voluntary participation
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Your participation in this research is entirely voluntary. You can withdraw from the study at any point without providing any reasons for doing so.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Reward
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      By participating in this research you can be selected for a 50€ reward. To qualify for the reward, participants must fully read and interact with at least five news articles per session within our system. At the end of the study, 10 participants will be randomly chosen, from those who satisfied the condition for the reward.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Procedure
                    </Typography>
                    {/* PILOT STUDY - 2 sessions version */}
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You will participate in this pilot study that consists of two weekly sessions spanning across two weeks.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      The study itself will consist of multiple steps. Steps 1, 2 and 3 will be conducted only once, at the start of the individuals' participation in the study. Steps 4 and 5 will be conducted at each occurrence of the study during the two week period. The last step - debriefing will occur once, after all the repeats of steps 4 and 5 are done, thus concluding your participation. The details of each step are following:
                    </Typography>
                    {/* MAIN STUDY - 3 sessions version (uncomment for main study)
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You will participate in this study that consists of weekly sessions spanning across four weeks.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      The study itself will consist of multiple steps. Steps 1, 2 and 3 will be conducted only once, at the start of the individuals' participation in the study. Steps 4 and 5 will be conducted at each occurrence of the study during the four week period. The last step - debriefing will occur once, after all the repeats of steps 4 and 5 are done, thus concluding your participation. The details of each step are following:
                    </Typography>
                    */}
                    <ol style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Informed Consent (approx. 5 minutes):</strong> Before your first session you will be provided with the Informed Consent Form (ICF) which you can sign and consent to if you wish to proceed further with the study. You will be provided with a method of contacting us in case you would seek clarifications on specific matters that may not be clear to you.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Preparation (approx. 5 minutes):</strong> At the beginning of the first session, upon consenting, you will be given the instruction to download the Informfully application for your mobile device or a link to the web application of the same platform. Additionally, you will be given the username and a passcode that you will use to login to the Informfully platform. Once that is done you may require some additional time to orient yourself on the application.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Initial questionnaire (approx. 5 minutes):</strong> During your first session you will also be presented with a set of demographic questions as well as questions that will assess your political activity and news consumption habits.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Pre-interaction assessment (approx. 2 minutes):</strong> At the start of each session, you will be asked to fill a short questionnaire, with questions on your opinions and preferences towards social topics, groups of people whose political stance is similar to yours and groups of people with a differing political stance to yours.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Interaction with news articles (approx. 10 minutes):</strong> At each occurrence of the weekly participation of the study, you will be asked to spend at least 10 minutes reading and rating news articles that will be recommended to you. You will be asked to first read multiple news articles and then rate the article using different measurements, which will be provided to you.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Debriefing (approx. 1 minute):</strong> After the participation, you will receive a debriefing e-mail, where a relief talk will be offered as well as the notification whether you were selected for the monetary reward or not and the step-by-step instructions on how to claim it.
                      </li>
                    </ol>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Risks and benefits
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      There are some of the risks one should be aware of before participating in the study:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Cognitive overload:</strong> While the reoccurring sessions will be kept short, a small percentage of individuals may experience cognitive overload from receiving a larger amount of information in a shorter period of time. If, anytime during your participation in the study, you experience desensitization or information fatigue, please refrain from continuing your participation and take a break. If the sensation of cognitive overload persists, or if the experienced overload was too impactful, please refrain from further participation in the study and contact us immediately, so that our psychological support expert may assist you.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Impact on well-being:</strong> Reading news articles on social topics that deal with topics that are divisive for the society, may cause stress or anxiety in some readers. Distressing or alarming news can heighten feelings of fear and worry. News stories that one may consider to be negative may also contribute to feelings of hopelessness or sadness, particularly for those who are already vulnerable to depression. Moreover, reading emotionally charged news repeatedly can mimic trauma exposure, leading to symptoms like nightmares or intrusive thoughts. If you experience any of the aforementioned symptoms or if you know that you are prone to anxiety, depression or post-traumatic stress, you are advised NOT to participate in the study. If you choose to participate regardless, remember that at any point you may contact us or the psychological support expert for any assistance.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Social and emotional impact:</strong> If you start to feel like you have developed a new found discomfort, distrust or hate towards a specific social topic or group, please contact us. Promoting distrust and/or hate between political groups or between differing minded individuals is not what the study is aimed to achieve and moreover, it goes against our moral code as researchers.
                      </li>
                    </ul>

                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      There are some potential benefits:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Broadening your perspective and political knowledge:</strong> Since participating in the study will have you reading and interacting with diverse perspectives over multiple social topics, you might experience a better understanding for one or multiple social topics. Moreover, you might find it more reasonable why someone would choose to hold a differing opinion to yours, having read and interacted with diverse perspectives on said topics. Over time, this might result in you perceiving the people with differing opinions to yours in a new light, possibly even providing for a more civilized (political) discussion with them.
                      </li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '12px' }}>
                        <strong>Social benefit:</strong> Your participation in this study is crucial for us to understand how to detect political stances in news articles and obtain insights how differing stances might have an effect on an individual. These insights might benefit the society as a whole, since researchers, developers of news sites and journalists may learn from this and take precautions so that the process of news media consumption is not as polarizing as it can be.
                      </li>
                    </ul>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Confidentiality
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      We will not share your personal information to anyone outside of the research team. Your real name and email will not be stored by us. All the communication will be done either through the participant recruitment platform (Prolific) or the news aggregator (Informfully) platform. Any other types of personally identifiable information will not appear in future publications and outputs. Any information about you will be marked by a participant ID instead of your name. Only members of the research group will have access to personally identifiable data and the consent forms. All the personal and contact information will be securely stored and destroyed when it is no longer needed.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Processing and storing your data
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Your responses will be collected through a set of questionnaires and from the interaction with the news article aggregation platform. The data will be stored in a safe place at the investigators' facility and only authorised personnel will have access to it. The response data will be kept in the anonymized form.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Data Breach
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      In case of a data breach, the person responsible for data protection will be informed by the responsible researcher. Together they will undertake all steps necessary to minimise any negative consequences. You will receive a notification about the nature of the data breach, the information lost and the actions taken as soon as possible.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Your rights
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You have the right to access your personal data, to correct it, to erase it, to restrict its processing, the right to data portability, and the right to object to in accordance with Articles 15-22 of the General Data Protection Regulation (GDPR). However, the right of erasure does not apply when the processing is necessary for the purposes of archiving that is in public interest, as well as the purposes of statistical analysis and scientific or historical research.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You can also withdraw your consent to process your personal data at any time according to GDPR Article 6(1) and Article 9(2) without any consequences. Upon request your local supervisory authority will provide you information on exercising your rights according to Article 57(e) GDPR.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Usage of your data
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Processed data will be used in research publications, for education purposes and for future research. The use will not be limited to the research group. Third parties will be able to access and process the anonymized data deposited on, for example, the Zenodo open research data platform.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      As a participant you can receive a summary of the results upon request.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Contact information
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '0px' }}>
                      If you require any form of emotional support during or at the end of the study, please contact our psychological support expert (email: hicup.care@famnit.upr.si) and briefly describe your issue. Please provide your contact information (e.g. email, phone number) so we can reach out to you. If necessary, we may schedule a relief talk. If you have any questions about the content, process or the goals of the study, you can contact the head researcher, Uroš Sergaš, (email: uros.sergas@upr.si).
                    </Typography>
                  </div>
                </Paper>

                {/* Consent Questions Table */}
                <Paper elevation={2} style={{ padding: '24px', marginBottom: '24px' }}>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '16px', fontWeight: 'bold' }}>
                    Consent Requirements
                  </Typography>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {CONSENT_QUESTIONS.map((question, index) => {
                      const isChecked = consentAnswers[index] || false;
                      const isRequired = true; // All questions are mandatory
                      
                      return (
                        <div 
                          key={index} 
                          data-consent-index={index}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start',
                            padding: '12px',
                            border: `2px solid ${!isChecked && isRequired ? '#f44336' : (isChecked ? '#4caf50' : '#e0e0e0')}`,
                            borderRadius: '4px',
                            backgroundColor: isChecked ? '#f8fff8' : (!isChecked && isRequired ? '#fff8f8' : '#ffffff'),
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => {
                              const newAnswers = { ...consentAnswers };
                              newAnswers[index] = e.target.checked;
                              setConsentAnswers(newAnswers);
                            }}
                            style={{ 
                              padding: '4px 8px 4px 0',
                              color: !isChecked && isRequired ? '#f44336' : '#1976d2'
                            }}
                            required={isRequired}
                          />
                          <div style={{ flex: 1 }}>
                            <Typography variant="body2" style={{ 
                              fontSize: '14px', 
                              lineHeight: '1.5',
                              marginTop: '4px',
                              color: !isChecked && isRequired ? '#d32f2f' : '#333'
                            }}>
                              {question}
                              <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>
                            </Typography>
                            {!isChecked && isRequired && (
                              <Typography variant="caption" style={{ 
                                color: '#d32f2f',
                                fontSize: '12px',
                                fontStyle: 'italic',
                                marginTop: '4px',
                                display: 'block'
                              }}>
                                This item must be checked to continue
                              </Typography>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Paper>

                {/* Participation Tasks Box */}
                <Paper elevation={2} style={{ padding: '24px', marginBottom: '32px', backgroundColor: '#f0f7ff' }}>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '16px', fontWeight: 'bold', color: '#1976d2' }}>
                    Participation Tasks
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '12px', fontWeight: '500' }}>
                    You will be asked to:
                  </Typography>
                  <ol style={{ marginLeft: '20px', marginBottom: '0' }}>
                    <li style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
                      Fill out the initial questionnaire
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
                      Choose a topic
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
                      Read at least 5 articles and press the "End session" button
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
                      Fill out a post questionnaire and receive the Prolific participation code
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '0' }}>
                      In a few days you will be invited to re-take the study again
                    </li>
                  </ol>
                </Paper>
                
                {/* Action Buttons */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  {/* Show warning if consent not checked */}
                  {Object.values(consentAnswers).filter(Boolean).length < CONSENT_QUESTIONS.length && (
                    <div style={{ 
                      marginBottom: '16px',
                      padding: '12px',
                      backgroundColor: '#fff3cd',
                      border: '1px solid #ffeaa7',
                      borderRadius: '4px',
                      color: '#856404'
                    }}>
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        ⚠️ Please check the consent box above to proceed with the study.
                      </Typography>
                    </div>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConsentSubmit}
                    disabled={Object.values(consentAnswers).filter(Boolean).length < CONSENT_QUESTIONS.length}
                    style={{ 
                      marginRight: '16px',
                      minWidth: '200px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      opacity: Object.values(consentAnswers).filter(Boolean).length < CONSENT_QUESTIONS.length ? 0.6 : 1
                    }}
                  >
                    {CONSENT_AGREE}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // Handle disagreement - could redirect or show message
                      alert('Thank you for your time. You will be redirected to the login page.');
                      window.location.href = '/login';
                    }}
                    style={{ 
                      minWidth: '200px',
                      padding: '12px 24px',
                      fontSize: '16px'
                    }}
                  >
                    {CONSENT_DISAGREE}
                  </Button>
                </div>
              </div>
            )}
            
            {currentStage === 'demographics' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '32px' }}>
                  {ONETIME_INTRO}
                </Typography>
                
                <Paper elevation={2} style={{ padding: '32px', marginBottom: '24px' }}>
                  {/* Q1: Demographics */}
                  <Typography variant="h5" gutterBottom style={{ marginBottom: '24px', color: '#1976d2' }}>
                    Demographic Information
                  </Typography>
                  
                  {/* Age */}
                  <FormControl variant="outlined" style={{ width: '100%', marginBottom: '24px' }}>
                    <InputLabel id="age-select-label">{DEMO_AGE_QUESTION} *</InputLabel>
                    <Select
                      labelId="age-select-label"
                      value={demographicsData.age || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, age: e.target.value})}
                      label={DEMO_AGE_QUESTION + ' *'}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select year of birth</em>
                      </MenuItem>
                      {DEMO_AGE_OPTIONS.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Gender */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {DEMO_GENDER_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.gender || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, gender: e.target.value})}
                    >
                      {DEMO_GENDER_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Education */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {DEMO_EDUCATION_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.education || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, education: e.target.value})}
                    >
                      {DEMO_EDUCATION_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Employment */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {DEMO_EMPLOYMENT_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.employment || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, employment: e.target.value})}
                    >
                      {DEMO_EMPLOYMENT_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>

                <Paper elevation={2} style={{ padding: '32px', marginBottom: '24px' }}>
                  {/* Q2: Civil Engagement */}
                  <Typography variant="h5" gutterBottom style={{ marginBottom: '24px', color: '#1976d2' }}>
                    {CIVIL_ENGAGEMENT_INTRO}
                  </Typography>
                  
                  {/* Voting */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {CIVIL_VOTED_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.voted || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, voted: e.target.value})}
                    >
                      {CIVIL_VOTED_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Political Activities */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {CIVIL_ACTIVITIES_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.politicalActivities || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, politicalActivities: e.target.value})}
                    >
                      {CIVIL_ACTIVITIES_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* Party Membership */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {CIVIL_MEMBER_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.partyMember || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, partyMember: e.target.value})}
                    >
                      {CIVIL_MEMBER_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>

                <Paper elevation={2} style={{ padding: '32px', marginBottom: '32px' }}>
                  {/* Q3: News Consumption */}
                  <Typography variant="h5" gutterBottom style={{ marginBottom: '24px', color: '#1976d2' }}>
                    {NEWS_CONSUMPTION_INTRO}
                  </Typography>
                  
                  {/* News Frequency */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {NEWS_FREQUENCY_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.newsFrequency || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, newsFrequency: e.target.value})}
                    >
                      {NEWS_FREQUENCY_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* News Frequency 2 - Political Content */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {NEWS_FREQUENCY2_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.newsFrequency2 || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, newsFrequency2: e.target.value})}
                    >
                      {NEWS_FREQUENCY_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {/* News Source - Multi-select */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px', textAlign: 'left' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px', textAlign: 'left' }}>
                      {NEWS_SOURCE_QUESTION} * (Select all that apply)
                    </FormLabel>
                    <div style={{ textAlign: 'left' }}>
                      {NEWS_SOURCE_OPTIONS.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={(demographicsData.newsSource || []).includes(option)}
                              onChange={(e) => {
                                const currentSources = demographicsData.newsSource || [];
                                const newSources = e.target.checked
                                  ? [...currentSources, option]
                                  : currentSources.filter(s => s !== option);
                                setDemographicsData({...demographicsData, newsSource: newSources});
                              }}
                            />
                          }
                          label={option}
                          style={{ marginBottom: '8px', display: 'block', textAlign: 'left' }}
                        />
                      ))}
                    </div>
                  </FormControl>

                </Paper>

                {/* Navigation Buttons */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Button
                    variant="outlined"
                    onClick={handlePreviousStage}
                    style={{ 
                      marginRight: '16px',
                      minWidth: '120px',
                      padding: '12px 24px'
                    }}
                  >
                    {BTN_PREVIOUS}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDemographicsSubmit}
                    style={{ 
                      minWidth: '120px',
                      padding: '12px 24px'
                    }}
                  >
                    {BTN_CONTINUE}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Weekly survey removed - now appears as popup in home page after topic selection */}
            {/* User selection removed - users are auto-created and logged in after demographics survey */}
          </div>
          
        </form>
      </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default withStyles(styles)(Register);
