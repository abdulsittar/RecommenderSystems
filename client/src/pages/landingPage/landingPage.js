
import { useStyles } from './landingPageStyle.js';

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
    const history = useHistory();
    const [randomID, setRandomID] = useState('');
    const classes = useStyles();
  
    // Fetch random ID from backend
    useEffect(() => {
      const fetchRandomID = async () => {
        try {
          const response = await axios.post('/posts/random_id'); // Make sure this path is correct
          setRandomID(response.data.yourID);
        } catch (error) {
          console.error("Error fetching random ID", error);
        }
      };
      
      fetchRandomID();
    }, []);
  
    const handleStartStudy = () => {
      if (randomID) {
        //history.push(`/study/${randomID}`); // Using the randomID in the URL
        const prolificPID = randomID;
        const studyID = 1;
        const sessionID = 1;

        //window.open(`https://socialapp2.ijs.si/study/${randomID}`, '_blank');

        window.open(`https://socialapp2.ijs.si/study/?PROLIFIC_PID=${prolificPID}&STUDY_ID=${studyID}&SESSION_ID=${sessionID}`,"_blank");

      } else {
        console.error("No random ID found");
      }
    };

  return (
    <div className={classes.container}>
      <div className={classes.welcomeText}>Welcome to the joint study of Jožef Stefan Institute and University of Primorska</div>
      <Button variant="contained" className={classes.button} onClick={handleStartStudy}>
      Click here to participate.
      </Button>
    </div>
  );
};

export default LandingPage;


