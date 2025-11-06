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
  NEWS_SOURCE_QUESTION,
  NEWS_SOURCE_OPTIONS,
  NEWS_TIME_QUESTION,
  NEWS_TIME_OPTIONS,
  // Weekly questions
  WEEKLY_INTRO,
  WEEKLY_POLITICAL_ISSUE_INTRO,
  WEEKLY_POLITICAL_ISSUE_QUESTION,
  WEEKLY_POLITICAL_ISSUE_SCALE,
  BTN_NEXT,
  BTN_PREVIOUS,
  BTN_SUBMIT,
  BTN_CONTINUE,
  PROGRESS_CONSENT,
  PROGRESS_DEMOGRAPHICS,
  PROGRESS_WEEKLY,
  ERROR_REQUIRED_FIELD,
  ERROR_INVALID_AGE,
  ERROR_NETWORK,
  SUCCESS_CONSENT,
  SUCCESS_DEMOGRAPHICS,
  SUCCESS_WEEKLY,
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
  const [currentStage, setCurrentStage] = useState('consent'); // 'consent', 'demographics', 'weekly', 'userSelection'
  const [uniqId, setUniqId] = useState('');
  
  // Form data state
  const [consentAnswers, setConsentAnswers] = useState({});
  const [demographicsData, setDemographicsData] = useState({});
  const [weeklyData, setWeeklyData] = useState({
    politicalIssue: 50 // Default to neutral (50)
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
  
  // User selection state (for the 4 profile options)
  const [selectedUserOption, setSelectedUserOption] = useState("");
  const [userProfiles, setUserProfiles] = useState([]);
  
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
          
          // Check if user needs to complete weekly survey
          if (loginResponse && loginResponse.needsWeeklySurvey) {
            console.log('User needs to complete weekly survey, redirecting...');
            history.push('/weekly-survey');
          } else {
            console.log('User does not need weekly survey, redirecting to home...');
            history.push("/");
          }
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
      const missingCount = uncheckedQuestions.length;
      toast.error(`Please check all ${CONSENT_QUESTIONS.length} consent boxes to continue. ${missingCount} ${missingCount === 1 ? 'item' : 'items'} still need to be checked.`);
      
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
      'newsFrequency', 'newsSource', 'newsTime'
    ];
    
    const missingFields = requiredFields.filter(field => !demographicsData[field]);
    
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
          newsSource: demographicsData.newsSource,
          newsTime: demographicsData.newsTime
        };
        
        // Make API call to save demographics data
        const response = await axios.post(`/presurvey/demographics/${uniqId}`, demographicsPayload);
        
        if (response.status === 200) {
          console.log('Demographics saved successfully:', response.data);
          // Skip weekly survey stage - go directly to user selection
          setCurrentStage('userSelection');
          toast.success('Demographics information saved successfully!');
          // Scroll to top of page for next stage
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          // Fetch user profiles for selection
          fetchUserProfiles();
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

  const handleWeeklySubmit = async () => {
    try {
      setButtonDisabled(true);
      
      // Make API call to save weekly data
      const response = await axios.post(`/presurvey/weekly/${uniqId}`, {
        ...weeklyData,
        weekNumber: 1 // This is the initial weekly survey
      });
      
      if (response.status === 200) {
        console.log('Weekly data saved successfully:', response.data);
        toast.success('Survey completed successfully!');
        
        // Scroll to top of page for next stage
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        
        // After survey completion, move to user selection
        setTimeout(() => {
          setCurrentStage('userSelection');
          // Fetch user profiles
          fetchUserProfiles();
        }, 1500); // Small delay to show the success message
      } else {
        throw new Error('Failed to save weekly data');
      }
    } catch (error) {
      console.error('Error saving weekly data:', error);
      toast.error('Error submitting survey. Please try again.');
    } finally {
      setButtonDisabled(false);
    }
  };

  const fetchUserProfiles = async () => {
    try {
      console.log('Fetching user profiles for uniqId:', uniqId);
      
      // Use the presurvey endpoint to get real user profiles like the original system
      const res = await axios.post(`/presurvey/isSubmitted/${uniqId}`);
      console.log('Presurvey response:', res.data);
      
      // Check if user already exists and should auto-login instead
      if (res.data.login === true) {
        console.log('User already exists, auto-logging in...');
        toast.info('User already registered. Logging you in...');
        
        // Auto-login using the unique ID and password (first 10 characters of unique ID)
        const password = uniqId.substring(0, 10);
        const username = res.data.user.username;
        
        try {
          const loginResponse = await loginCall({ 
            username: username, 
            password: password,
            uniqueId: uniqId
          }, dispatch);
          
          // Check if user needs to complete weekly survey
          if (loginResponse && loginResponse.needsWeeklySurvey) {
            console.log('User needs to complete weekly survey, redirecting...');
            history.push('/weekly-survey');
          } else {
            console.log('User does not need weekly survey, redirecting to home...');
            history.push("/");
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          toast.error('Login failed. Please try again.');
          // If auto-login fails, fall back to manual login page
          history.push(`/login/${uniqId}`);
        }
        return;
      }
      
      // Check if we have user profiles for selection
      if (res.data.users && res.data.users.length > 0) {
        console.log('Raw users from server:', res.data.users);
        
        // Extract users from the response format similar to backup
        const profiles = res.data.users.map(userObj => {
          // Handle different possible formats from aggregation
          const user = userObj.user || userObj; // Handle both {user: {...}} and direct {...} formats
          console.log('Processing user:', user);
          
          return {
            _id: user._id || user.username,
            username: user.username,
            username_second: user.username_second,
            profilePicture: user.profilePicture,
            available: user.available,
            version: user.version
          };
        }).filter(profile => profile.username); // Filter out any malformed profiles
        
        console.log('Setting real user profiles:', profiles);
        setUserProfiles(profiles.slice(0, 4)); // Limit to 4 users like original
      } else {
        // Use fallback mock data if no real users available
        console.log('No real user profiles available, using fallback');
        const fallbackProfiles = [
          { _id: "temp1", username: "user1", profilePicture: "person/1.jpeg" },
          { _id: "temp2", username: "user2", profilePicture: "person/2.jpeg" },
          { _id: "temp3", username: "user3", profilePicture: "person/3.jpeg" },
          { _id: "temp4", username: "user4", profilePicture: "person/4.jpeg" }
        ];
        setUserProfiles(fallbackProfiles);
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      // Use fallback mock data if API fails
      const fallbackProfiles = [
        { _id: "temp1", username: "user1", profilePicture: "person/1.jpeg" },
        { _id: "temp2", username: "user2", profilePicture: "person/2.jpeg" },
        { _id: "temp3", username: "user3", profilePicture: "person/3.jpeg" },
        { _id: "temp4", username: "user4", profilePicture: "person/4.jpeg" }
      ];
      setUserProfiles(fallbackProfiles);
      toast.error('Using fallback profiles. Backend user profiles not available.');
    }
  };  const submitNext = async (e) => {
    e.preventDefault();
    
    if (!selectedUserOption) {
      toast.error('Please select a user profile to continue.');
      return;
    }

    try {
      console.log('Selected user option:', selectedUserOption);
      console.log('Available user profiles:', userProfiles);
      
      // Find the selected user profile
      const selectedIndex = parseInt(selectedUserOption.replace('option', '')) - 1;
      const selectedUser = userProfiles[selectedIndex];
      
      console.log('Selected user data:', selectedUser);

      if (selectedUser) {
        // Create user object with survey data like the old system
        const user = {
          ...demographicsData, // Include demographic data
          ...weeklyData,       // Include weekly survey data  
          username: selectedUser.username_second, // Use username_second from selected profile
          password: uniqId.substring(0, 10), // Use first 10 chars of uniqueId as password
          username_second: selectedUser.username_second, // Keep username_second same
          profilePicture: selectedUser.profilePicture,
          pool: 1, // Default pool
          uniqId: uniqId // Include the unique ID
        };

        console.log('Creating user account with survey data and selected profile:', user);
        
        // Register the user using the same API as the old system
        const userRes = await axios.post(`/auth/register/${uniqId}`, user);
        console.log('User registration response:', userRes);
        
        if (userRes.data) {
          const createdUser = userRes.data;
          console.log('Created user:', createdUser);
          
          // Try to login to get the auth token
          try {
            const loginRes = await axios.post(`/auth/login`, {
              username: selectedUser.username_second, // Match the registered username
              password: uniqId.substring(0, 10) // Use first 10 chars of uniqueId
            });
            
            if (loginRes.data && loginRes.data.token) {
              console.log('Login successful, got token:', loginRes.data.token);
              localStorage.setItem("token", loginRes.data.token);
              localStorage.setItem("user", JSON.stringify(loginRes.data.user));
              dispatch({ type: "LOGIN_SUCCESS", payload: loginRes.data.user });
              
              // Successfully logged in after registration
              const token = loginRes.data.token;
              const user = loginRes.data.user;
              console.log('Login successful, user created and logged in');
              
              // Don't create initial data here - user will select topic in Feed first
              // Topic selection → Weekly Survey → Initial data creation → Feed content
              
              toast.success('Account created successfully! Redirecting...');
              dispatch({ type: "LOGIN_SUCCESS", payload: user });
              // Set flag to show weekly survey after first time topic selection
              localStorage.setItem('showWeeklySurvey', 'true');
              localStorage.setItem('weeklySurveyReason', 'firstTime');
              setTimeout(() => {
                console.log('Redirecting to homepage. User will select topic, then see weekly survey...');
                history.push('/');
              }, 2000);
            }
          } catch (loginError) {
            console.error('Login error after registration:', loginError);
            toast.error('Account created but login failed. Please try logging in manually.');
          }
        }
      } else {
        toast.error('Invalid user selection. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message || error.response.status}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handlePreviousStage = () => {
    switch(currentStage) {
      case 'demographics':
        setCurrentStage('consent');
        break;
      case 'weekly':
        setCurrentStage('demographics');
        break;
      case 'userSelection':
        setCurrentStage('weekly');
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
      
      <div className={classes.register}>
        <form className={classes.form} noValidate autoComplete="off">
          
          {/* TODO: Replace with new three-stage survey JSX */}
          <div className={classes.wrapper}>
            <h1>Three-Stage Survey</h1>
            <p>Current Stage: {currentStage}</p>
            <p>Unique ID: {uniqId}</p>
            
            {currentStage === 'consent' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '32px' }}>
                  {CONSENT_WELCOME}
                </Typography>
                
                <Typography variant="body1" paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {CONSENT_INTRODUCTION}
                </Typography>

                {/* Study Title */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '32px', marginBottom: '16px' }}>
                  {CONSENT_STUDY_TITLE}
                </Typography>
                
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_RESEARCHERS}
                </Typography>

                {/* Purpose Section */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_PURPOSE_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_PURPOSE}
                </Typography>

                {/* Procedure Section */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_PROCEDURE_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_PROCEDURE}
                </Typography>

                {/* Requirements */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_REQUIREMENTS_TITLE}
                </Typography>
                <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                  {CONSENT_REQUIREMENTS.map((requirement, index) => (
                    <li key={index} style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                      {requirement}
                    </li>
                  ))}
                </ul>

                {/* Time Commitment */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_TIME_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_TIME}
                </Typography>

                {/* Voluntary Participation */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_VOLUNTARY_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_VOLUNTARY}
                </Typography>

                {/* Data Protection */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_DATA_PROTECTION_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_DATA_PROTECTION}
                </Typography>

                {/* Data Sharing */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_DATA_SHARING_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_DATA_SHARING}
                </Typography>

                {/* Contact Information */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_CONTACT_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {CONSENT_CONTACT}
                </Typography>

                {/* Complaints */}
                <Typography variant="h6" gutterBottom style={{ marginTop: '24px', marginBottom: '12px' }}>
                  {CONSENT_COMPLAINTS_TITLE}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
                  {CONSENT_COMPLAINTS}
                </Typography>

                {/* Consent Questions Table */}
                <Paper elevation={2} style={{ padding: '24px', marginBottom: '32px' }}>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '8px' }}>
                    Consent Requirements
                  </Typography>
                  <Typography variant="body2" style={{ 
                    marginBottom: '20px', 
                    color: '#d32f2f',
                    fontWeight: 'bold'
                  }}>
                    * All items below are mandatory and must be checked to participate in the study.
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
                  
                  {/* Progress indicator */}
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="body2" style={{ 
                      color: Object.values(consentAnswers).filter(Boolean).length === CONSENT_QUESTIONS.length ? '#4caf50' : '#666',
                      fontWeight: 'bold'
                    }}>
                      Progress: {Object.values(consentAnswers).filter(Boolean).length} of {CONSENT_QUESTIONS.length} items checked
                    </Typography>
                  </div>
                </Paper>
                
                {/* Action Buttons */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  {/* Show warning if not all items are checked */}
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
                        ⚠️ Please check all {CONSENT_QUESTIONS.length} consent items above to proceed with the study.
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
                    {Object.values(consentAnswers).filter(Boolean).length < CONSENT_QUESTIONS.length && (
                      <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                        ({Object.values(consentAnswers).filter(Boolean).length}/{CONSENT_QUESTIONS.length})
                      </span>
                    )}
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
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {DEMO_AGE_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.age || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, age: e.target.value})}
                    >
                      {DEMO_AGE_OPTIONS.map((option, index) => (
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
                          value={option}
                          control={<Radio />}
                          label={option}
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
                          value={option}
                          control={<Radio />}
                          label={option}
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

                  {/* News Source */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {NEWS_SOURCE_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.newsSource || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, newsSource: e.target.value})}
                    >
                      {NEWS_SOURCE_OPTIONS.map((option, index) => (
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

                  {/* News Time */}
                  <FormControl component="fieldset" style={{ width: '100%', marginBottom: '24px' }}>
                    <FormLabel component="legend" style={{ marginBottom: '12px', fontSize: '16px' }}>
                      {NEWS_TIME_QUESTION} *
                    </FormLabel>
                    <RadioGroup
                      value={demographicsData.newsTime || ''}
                      onChange={(e) => setDemographicsData({...demographicsData, newsTime: e.target.value})}
                    >
                      {NEWS_TIME_OPTIONS.map((option, index) => (
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
            
            {currentStage === 'weekly' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '32px' }}>
                  {WEEKLY_INTRO}
                </Typography>
                
                <Paper elevation={2} style={{ padding: '32px', marginBottom: '24px' }}>
                  <Typography variant="h5" gutterBottom style={{ marginBottom: '24px', color: '#1976d2' }}>
                    {WEEKLY_POLITICAL_ISSUE_INTRO}
                  </Typography>
                  
                  <Typography variant="body1" paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <strong>Note:</strong> This section would contain weekly assessment questions about specific political topics.
                    The questions would be dynamically generated based on current political issues and would include:
                  </Typography>
                  
                  <ul style={{ marginLeft: '20px', marginBottom: '24px' }}>
                    <li style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                      Attitude toward specific political issues (0-100 scale)
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                      Rating of political opponents on various traits (0-10 scales)
                    </li>
                    <li style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                      Social distance measures (comfort with political out-group members)
                    </li>
                  </ul>
                  
                  <Typography variant="body2" style={{ 
                    padding: '16px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '4px',
                    marginBottom: '24px'
                  }}>
                    <strong>Example Question:</strong><br />
                    {WEEKLY_POLITICAL_ISSUE_QUESTION}<br />
                    <em>{WEEKLY_POLITICAL_ISSUE_SCALE}</em>
                  </Typography>
                  
                  {/* Interactive Slider */}
                  <Box style={{ marginTop: '32px', marginBottom: '32px', padding: '0 32px' }}>
                    <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold', marginBottom: '16px' }}>
                      Your Response:
                    </Typography>
                    <Slider
                      value={weeklyData.politicalIssue}
                      onChange={(e, value) => setWeeklyData({ ...weeklyData, politicalIssue: value })}
                      min={0}
                      max={100}
                      valueLabelDisplay="on"
                      marks={[
                        { value: 0, label: '0 (Very unfavorable)' },
                        { value: 50, label: '50 (Neutral)' },
                        { value: 100, label: '100 (Very favorable)' }
                      ]}
                      style={{ marginTop: '40px', marginBottom: '50px' }}
                    />
                  </Box>
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
                    onClick={handleWeeklySubmit}
                    style={{ 
                      minWidth: '120px',
                      padding: '12px 24px'
                    }}
                  >
                    {BTN_SUBMIT}
                  </Button>
                </div>
              </div>
            )}

            {currentStage === 'userSelection' && (
              <div>
                <Typography variant="h6" gutterBottom>
                  Select Your Profile
                </Typography>
                <Typography variant="body2" style={{ marginBottom: 20 }}>
                  Please choose one of the following user profiles to continue.
                </Typography>
                
                {userProfiles.length > 0 ? (
                  <div>
                    {userProfiles && userProfiles.length > 0 && userProfiles.slice(0, 4).map((user, index) => {
                      const optionValue = `option${index + 1}`;
                      
                      return (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '16px',
                          padding: '12px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          backgroundColor: selectedUserOption === optionValue ? '#f0f8ff' : 'white'
                        }}>
                          <input 
                            type="radio" 
                            value={optionValue}
                            checked={selectedUserOption === optionValue}
                            onChange={(e) => setSelectedUserOption(e.target.value)}
                            style={{ accentColor: 'red', marginRight: '12px' }}
                          />
                          <img 
                            width="50" 
                            height="50"
                            src={user.profilePicture ? `${PF}${user.profilePicture}` : `${PF}person/noCover.png`}
                            alt={user.username || `Profile ${index + 1}`}
                            style={{ 
                              borderRadius: '50%',
                              marginRight: '12px',
                              objectFit: 'cover'
                            }}
                          />
                          <span style={{ fontSize: '16px' }}>
                            {user.username || `User ${index + 1}`}
                          </span>
                        </div>
                      );
                    })}
                    
                    {(!userProfiles || userProfiles.length === 0) && (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        Loading user profiles...
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                      <Button
                        variant="outlined"
                        onClick={handlePreviousStage}
                        style={{ 
                          minWidth: '120px',
                          padding: '12px 24px'
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={submitNext}
                        disabled={!selectedUserOption}
                        style={{ 
                          minWidth: '120px',
                          padding: '12px 24px'
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Typography variant="body1">Loading user profiles...</Typography>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </form>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default withStyles(styles)(Register);
