import React from 'react';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Progress from "./pages/progress/Progress";
import Register from "./pages/register/Register";
import FollowersPage from "./pages/Followers/FollowersPage";
import FollowingsPage from "./pages/Followings/FollowingsPage";
import WeeklySurvey from "./pages/weeklySurvey/WeeklySurvey";
import ThankYou from "./pages/thankyou/ThankYou";
import {regSw, subscribe} from './helper.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Postdetail from "./pages/postDetail/Postdetail";
import LandingPage from "./pages/landingPage/landingPage.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Postsurvey from './pages/postsurvey/postsurvey';
import PostSurveySimplified from './pages/postsurvey/PostSurveySimplified';


function App() {
  const { user } = useContext(AuthContext);

  
  return (
    
    <Router>
    <Switch>
    <Route path="/thankyou/:userId"><ThankYou /></Route>
    <Route path="/landingPage"><LandingPage/></Route>
		<Route exact path="/">{user ? <Home /> : <LandingPage />}</Route>
		<Route path="/login/:userId"><Login /></Route>
    <Route exact path="/study"><Register /></Route>
    <Route path="/study/:userId"><Register /></Route>
		<Route path="/register/:userId"><Register /></Route> 
		<Route path="/weekly-survey">{user ? <WeeklySurvey /> : <Redirect to="/landingPage" />}</Route>
		<Route path="/profile/:username"><Profile /></Route>
    <Route path="/progress/:username"><Progress /></Route>
    <Route path="/postsurvey-pilot">{user ? <PostSurveySimplified /> : <Redirect to="/landingPage" />}</Route>
    <Route path="/postsurvey/:username"><Postsurvey /></Route>
    <Route path="/followerspage/:username"><FollowersPage /></Route>
    <Route path="/followingspage/:username"><FollowingsPage /></Route>
    <Route path="/postdetail/:username"><Postdetail /></Route>
    </Switch>
  </Router>

  );
}

export default App;