import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Paper,
  Container,
  Slider,
  Box
} from '@material-ui/core';
import {
  WEEKLY_INTRO,
  WEEKLY_POLITICAL_ISSUE_INTRO,
  WEEKLY_POLITICAL_ISSUE_QUESTION,
  WEEKLY_POLITICAL_ISSUE_SCALE,
  WEEKLY_POLITICAL_OUTGROUP_INTRO,
  WEEKLY_OPENMINDED_QUESTION,
  WEEKLY_OPENMINDED_SCALE,
  WEEKLY_EXTREMIST_QUESTION,
  WEEKLY_EXTREMIST_SCALE,
  WEEKLY_MORAL_QUESTION,
  WEEKLY_MORAL_SCALE,
  WEEKLY_SOCIAL_DISTANCE_INTRO,
  WEEKLY_FAMILY_QUESTION,
  WEEKLY_FAMILY_SCALE,
  WEEKLY_FRIEND_QUESTION,
  WEEKLY_FRIEND_SCALE,
  WEEKLY_COWORKER_QUESTION,
  WEEKLY_COWORKER_SCALE,
  SUCCESS_WEEKLY
} from '../../constants_STA';

const styles = (theme) => ({
  container: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  subtitle: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  question: {
    marginBottom: theme.spacing(1),
  },
  scale: {
    marginBottom: theme.spacing(2),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 4),
  },
  slider: {
    margin: theme.spacing(2, 0),
  },
  successMessage: {
    color: theme.palette.success.main,
    textAlign: 'center',
    marginTop: theme.spacing(2),
  }
});

function WeeklySurvey({ classes }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  
  const [weeklyData, setWeeklyData] = useState({
    politicalIssue: 50, // Default to neutral (50)
    openminded: 5,      // Default to middle (5)
    extremist: 5,       // Default to middle (5)
    moral: 5,           // Default to middle (5)
    family: 5,          // Default to middle (5)
    friend: 5,          // Default to middle (5)
    coworker: 5         // Default to middle (5)
  });

  const handleSliderChange = (field, value) => {
    setWeeklyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      history.push('/login');
      return;
    }

    try {
      // Calculate current week number (simplified - you may want more sophisticated logic)
      const now = new Date();
      const weekNumber = Math.floor((now.getTime() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));

      const response = await axios.post(`/presurvey/weekly/${user.uniqueId}`, {
        ...weeklyData,
        weekNumber: weekNumber,
        userId: user._id
      });

      if (response.status === 200) {
        console.log('Weekly survey submitted successfully:', response.data);
        setSubmitted(true);
        
        // Redirect to home after a short delay
        setTimeout(() => {
          history.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting weekly survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant="h4" className={classes.successMessage}>
            {SUCCESS_WEEKLY}
          </Typography>
          <Typography variant="body1" align="center" style={{ marginTop: 16 }}>
            Redirecting you to the main feed...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
          Weekly Survey
        </Typography>
        
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_INTRO}
        </Typography>

        {/* Political Issue Rating */}
        <Typography variant="h6" className={classes.subtitle}>
          {WEEKLY_POLITICAL_ISSUE_INTRO}
        </Typography>
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_POLITICAL_ISSUE_QUESTION.replace('[specific political issue]', 'current political issues')}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_POLITICAL_ISSUE_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.politicalIssue}
            onChange={(e, value) => handleSliderChange('politicalIssue', value)}
            min={0}
            max={100}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unfavorable)' },
              { value: 50, label: '50 (Neutral)' },
              { value: 100, label: '100 (Very favorable)' }
            ]}
          />
        </Box>

        {/* Political Outgroup Ratings */}
        <Typography variant="h6" className={classes.subtitle}>
          {WEEKLY_POLITICAL_OUTGROUP_INTRO}
        </Typography>

        {/* Open-minded vs Close-minded */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_OPENMINDED_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OPENMINDED_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.openminded}
            onChange={(e, value) => handleSliderChange('openminded', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Close-minded)' },
              { value: 10, label: '10 (Open-minded)' }
            ]}
          />
        </Box>

        {/* Moderate vs Extremist */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_EXTREMIST_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_EXTREMIST_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.extremist}
            onChange={(e, value) => handleSliderChange('extremist', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Moderate)' },
              { value: 10, label: '10 (Extremist)' }
            ]}
          />
        </Box>

        {/* Immoral vs Moral */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_MORAL_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_MORAL_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.moral}
            onChange={(e, value) => handleSliderChange('moral', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Immoral)' },
              { value: 10, label: '10 (Moral)' }
            ]}
          />
        </Box>

        {/* Social Distance */}
        <Typography variant="h6" className={classes.subtitle}>
          {WEEKLY_SOCIAL_DISTANCE_INTRO}
        </Typography>

        {/* Family */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_FAMILY_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_FAMILY_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.family}
            onChange={(e, value) => handleSliderChange('family', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unhappy)' },
              { value: 10, label: '10 (Very happy)' }
            ]}
          />
        </Box>

        {/* Friend */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_FRIEND_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_FRIEND_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.friend}
            onChange={(e, value) => handleSliderChange('friend', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unhappy)' },
              { value: 10, label: '10 (Very happy)' }
            ]}
          />
        </Box>

        {/* Coworker */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_COWORKER_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_COWORKER_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={weeklyData.coworker}
            onChange={(e, value) => handleSliderChange('coworker', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unhappy)' },
              { value: 10, label: '10 (Very happy)' }
            ]}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSubmit}
          fullWidth
        >
          Submit Weekly Survey
        </Button>
      </Paper>
    </Container>
  );
}

export default withStyles(styles)(WeeklySurvey);