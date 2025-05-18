
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
        window.open(`https://socialapp2.ijs.si/register/${randomID}`, '_blank');
      } else {
        console.error("No random ID found");
      }
    };

  return (
    <div className={classes.container}>
      <div className={classes.welcomeText}>Dobrodošli u istraživački projekat TWON</div>
      <Button variant="contained" className={classes.button} onClick={handleStartStudy}>
      Kliknite ovde da biste učestvovali
      </Button>
    </div>
  );
};

export default LandingPage;


