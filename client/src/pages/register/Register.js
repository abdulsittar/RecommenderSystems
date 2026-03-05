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
  const [secondSessionBlockedInfo, setSecondSessionBlockedInfo] = useState(null);

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
          const gateData = loginError?.response?.data;

          if (gateData?.tooEarlySecondSession) {
            setSecondSessionBlockedInfo({
              hoursRemaining: gateData.hoursRemaining,
              minutesRemaining: gateData.minutesRemaining,
              canLoginAt: gateData.canLoginAt,
              firstSessionAt: gateData.firstSessionAt
            });
            toast.info('Your second session will be available after 48 hours from your first session.');
            return;
          }

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
        {secondSessionBlockedInfo ? (
          <div style={{ maxWidth: '760px', margin: '40px auto', width: '100%' }}>
            <Paper elevation={2} style={{ padding: '28px' }}>
              <Typography variant="h5" style={{ marginBottom: '14px', fontWeight: 'bold' }}>
                Your 2nd session is not available yet
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px', lineHeight: '1.7' }}>
                There must be at least 48 hours between your 1st and 2nd sessions.
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '10px', lineHeight: '1.7' }}>
                Please come back later via your Prolific invitation link.
              </Typography>
              {secondSessionBlockedInfo?.hoursRemaining !== undefined && (
                <Typography variant="body1" style={{ marginBottom: '8px', fontWeight: '600' }}>
                  Time remaining: {secondSessionBlockedInfo.hoursRemaining} hour(s)
                </Typography>
              )}
              {secondSessionBlockedInfo?.canLoginAt && (
                <Typography variant="body2" color="textSecondary">
                  Earliest available time: {new Date(secondSessionBlockedInfo.canLoginAt).toLocaleString()}
                </Typography>
              )}
            </Paper>
          </div>
        ) : (
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
                <Paper elevation={1} style={{ padding: '16px', marginBottom: '24px', backgroundColor: '#f5f5f5', textAlign: 'left' }}>
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
                      This form has two sections. The first provides information about the study, explains how your data will be processed and used, and what are your rights. Please read it carefully and if there is anything that might not be clear to you, feel free to contact us. The second section consists of a certificate of consent where you are asked to verify your agreement to participate by confirming the consent form.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      About the organisation
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
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
                      Participation in this study is voluntary. You may participate if you are at least 18 years old, have sufficient knowledge of English, have access to a computer or smartphone with internet connection, and are willing to take part in a longitudinal study involving regular interactions over multiple weeks.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You should not participate if you live in a country where engaging with political news content could pose legal risks, if engaging with potentially divisive news content may cause you psychological distress, or if you are professionally involved in news media or research on news media.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You may withdraw from the study at any time without providing a reason and without any negative consequences.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Procedure
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      The study is conducted over a period of four weeks and consists of weekly sessions. Participation includes an initial onboarding phase with consent and a short questionnaire, followed by recurring sessions in which you read and evaluate recommended news articles using a web or mobile platform. At the end of the study, you will receive a debriefing message with additional information about the study and the reward process.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Risks and benefits
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Participation may involve exposure to news content on socially or politically sensitive topics. Some participants may experience discomfort, stress, or information fatigue. If you experience distress at any point, you are encouraged to pause or discontinue participation and contact the research team or the designated psychological support expert.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Potential benefits include increased awareness of diverse perspectives and contribution to research that may help improve the design of news platforms and reduce harmful polarization in news consumption.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Data Protection and Confidentiality
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Your participation will involve the collection of questionnaire responses and interaction data from the news aggregation platform. Personal identifiers such as your real name and email address will not be stored by the research team. All data will be anonymized, labeled using participant IDs, and securely stored. Only authorized members of the research team will have access to identifiable data and consent forms.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      In the event of a data breach, appropriate measures will be taken to minimize potential harm, and you will be informed as soon as possible.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Usage of Data and Your Rights
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      Anonymized research data may be used for scientific publications, educational purposes, and future research, and may be shared with third parties through open research data repositories such as Zenodo. You may request a summary of the study results.
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify' }}>
                      You have the right to access, correct, restrict, or object to the processing of your personal data in accordance with Articles 15–22 of the General Data Protection Regulation (GDPR). You may withdraw consent for data processing at any time without consequences. Certain rights, such as erasure, may be limited where data processing is necessary for scientific research purposes.
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px', fontWeight: 'bold' }}>
                      Contact information
                    </Typography>
                    <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '0px' }}>
                      If you require emotional support during or after participation, you may contact the psychological support expert at hicup.care@famnit.upr.si<br />
                      For questions regarding the study, its procedures, or objectives, you may contact the lead researcher, Uroš Sergaš, at uros.sergas@upr.si
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
                <Paper elevation={2} style={{ padding: '24px', marginBottom: '32px', backgroundColor: '#f0f7ff', textAlign: 'left' }}>
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
        )}
      </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default withStyles(styles)(Register);
