import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Paper,
  Container,
  Slider,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import {
  WEEKLY_INTRO,
  WEEKLY_ATTITUDE_QUESTION,
  WEEKLY_ATTITUDE_SCALE,
  WEEKLY_ONE_SIDE_INTRO,
  WEEKLY_ONE_SIDE_OPENMINDED_QUESTION,
  WEEKLY_ONE_SIDE_OPENMINDED_SCALE,
  WEEKLY_ONE_SIDE_MODERATE_QUESTION,
  WEEKLY_ONE_SIDE_MODERATE_SCALE,
  WEEKLY_ONE_SIDE_MORAL_QUESTION,
  WEEKLY_ONE_SIDE_MORAL_SCALE,
  WEEKLY_ONE_SIDE_SOCIAL_INTRO,
  WEEKLY_ONE_SIDE_FAMILY_QUESTION,
  WEEKLY_ONE_SIDE_FAMILY_SCALE,
  WEEKLY_ONE_SIDE_FRIEND_QUESTION,
  WEEKLY_ONE_SIDE_FRIEND_SCALE,
  WEEKLY_ONE_SIDE_COWORKER_QUESTION,
  WEEKLY_ONE_SIDE_COWORKER_SCALE,
  WEEKLY_OTHER_SIDE_INTRO,
  WEEKLY_OTHER_SIDE_OPENMINDED_QUESTION,
  WEEKLY_OTHER_SIDE_OPENMINDED_SCALE,
  WEEKLY_OTHER_SIDE_MODERATE_QUESTION,
  WEEKLY_OTHER_SIDE_MODERATE_SCALE,
  WEEKLY_OTHER_SIDE_MORAL_QUESTION,
  WEEKLY_OTHER_SIDE_MORAL_SCALE,
  WEEKLY_OTHER_SIDE_SOCIAL_INTRO,
  WEEKLY_OTHER_SIDE_FAMILY_QUESTION,
  WEEKLY_OTHER_SIDE_FAMILY_SCALE,
  WEEKLY_OTHER_SIDE_FRIEND_QUESTION,
  WEEKLY_OTHER_SIDE_FRIEND_SCALE,
  WEEKLY_OTHER_SIDE_COWORKER_QUESTION,
  WEEKLY_OTHER_SIDE_COWORKER_SCALE
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
  },
  feedbackField: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  }
});

function PostSurveySimplified({ classes }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [thankYouDialogOpen, setThankYouDialogOpen] = useState(false);
  
  // Session 2 completion code
  const prolificCode = 'C13KYEZD';
  const prolificLink = 'https://app.prolific.com/submissions/complete?cc=C13KYEZD';
  
  const [surveyData, setSurveyData] = useState({
    // Q1: Overall attitude
    topicAttitude: 50,
    
    // Q2-Q7: ONE SIDE perceptions
    oneSide_openminded: 5,
    oneSide_moderate: 5,
    oneSide_moral: 5,
    oneSide_family: 5,
    oneSide_friend: 5,
    oneSide_coworker: 5,
    
    // Q8-Q13: OTHER SIDE perceptions
    otherSide_openminded: 5,
    otherSide_moderate: 5,
    otherSide_moral: 5,
    otherSide_family: 5,
    otherSide_friend: 5,
    otherSide_coworker: 5,
    
    // Optional feedback
    feedback: ''
  });

  const [userTopic, setUserTopic] = useState('');

  useEffect(() => {
    // Get user's topic
    const fetchUserTopic = async () => {
      if (user && user._id) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/users?userId=${user._id}`, {
            headers: { 'auth-token': token }
          });
          if (response.data && response.data.currentTopic) {
            setUserTopic(response.data.currentTopic);
          }
        } catch (error) {
          console.error('Error fetching user topic:', error);
        }
      }
    };
    fetchUserTopic();
  }, [user]);

  const handleSliderChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeedbackChange = (event) => {
    setSurveyData(prev => ({
      ...prev,
      feedback: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      history.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/postsurvey/simplified/${user._id}`, {
        ...surveyData,
        userId: user._id,
        topic: userTopic
      }, {
        headers: { 'auth-token': token }
      });

      if (response.status === 200) {
        console.log('Post-survey submitted successfully:', response.data);
        setSubmitted(true);
        setThankYouDialogOpen(true);
      }
    } catch (error) {
      console.error('Error submitting post-survey:', error);
      if (error.response && error.response.status === 400) {
        alert('You have already submitted the post-survey.');
        setSubmitted(true);
        setThankYouDialogOpen(true);
      } else {
        alert('There was an error submitting your survey. Please try again.');
      }
    }
  };

  const handleCloseThankYouDialog = () => {
    setThankYouDialogOpen(false);
    // Log out and redirect to Prolific completion page
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = prolificLink;
  };

  // Helper function to get side labels based on topic
  const getSideLabels = () => {
    const topicLower = userTopic.toLowerCase();
    if (topicLower.includes('abortion')) {
      return { oneSide: 'pro-choice advocates', otherSide: 'pro-life advocates' };
    } else if (topicLower.includes('military') || topicLower.includes('armament')) {
      return { oneSide: 'pro-military advocates', otherSide: 'anti-military advocates' };
    } else if (topicLower.includes('social media')) {
      return { oneSide: 'regulation advocates', otherSide: 'free speech advocates' };
    }
    return { oneSide: 'one side advocates', otherSide: 'other side advocates' };
  };

  const { oneSide, otherSide } = getSideLabels();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
          Post-Study Survey
        </Typography>
        
        <Typography variant="body1" className={classes.question}>
          Thank you for completing the study! Please answer the following questions about{' '}
          <strong>{userTopic || 'your topic'}</strong> one final time.
        </Typography>

        {/* Q1: Political Issue Rating */}
        <Typography variant="h6" className={classes.subtitle}>
          Overall Attitude
        </Typography>
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_ATTITUDE_QUESTION} {userTopic || 'this topic'}?
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ATTITUDE_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.topicAttitude}
            onChange={(e, value) => handleSliderChange('topicAttitude', value)}
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

        {/* ONE SIDE Ratings */}
        <Typography variant="h6" className={classes.subtitle}>
          Perceptions of {oneSide}
        </Typography>

        {/* Open-minded vs Close-minded */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_ONE_SIDE_OPENMINDED_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_OPENMINDED_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_openminded}
            onChange={(e, value) => handleSliderChange('oneSide_openminded', value)}
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
          {WEEKLY_ONE_SIDE_MODERATE_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_MODERATE_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_moderate}
            onChange={(e, value) => handleSliderChange('oneSide_moderate', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Extreme)' },
              { value: 10, label: '10 (Moderate)' }
            ]}
          />
        </Box>

        {/* Immoral vs Moral */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_ONE_SIDE_MORAL_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_MORAL_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_moral}
            onChange={(e, value) => handleSliderChange('oneSide_moral', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Immoral)' },
              { value: 10, label: '10 (Moral)' }
            ]}
          />
        </Box>

        {/* Social Distance - ONE SIDE */}
        <Typography variant="h6" className={classes.subtitle}>
          {WEEKLY_ONE_SIDE_SOCIAL_INTRO}
        </Typography>

        {/* Family */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_ONE_SIDE_FAMILY_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_FAMILY_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_family}
            onChange={(e, value) => handleSliderChange('oneSide_family', value)}
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
          {WEEKLY_ONE_SIDE_FRIEND_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_FRIEND_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_friend}
            onChange={(e, value) => handleSliderChange('oneSide_friend', value)}
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
          {WEEKLY_ONE_SIDE_COWORKER_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_ONE_SIDE_COWORKER_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.oneSide_coworker}
            onChange={(e, value) => handleSliderChange('oneSide_coworker', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unhappy)' },
              { value: 10, label: '10 (Very happy)' }
            ]}
          />
        </Box>

        {/* OTHER SIDE Ratings */}
        <Typography variant="h6" className={classes.subtitle}>
          Perceptions of {otherSide}
        </Typography>

        {/* Open-minded vs Close-minded */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_OTHER_SIDE_OPENMINDED_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_OPENMINDED_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_openminded}
            onChange={(e, value) => handleSliderChange('otherSide_openminded', value)}
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
          {WEEKLY_OTHER_SIDE_MODERATE_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_MODERATE_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_moderate}
            onChange={(e, value) => handleSliderChange('otherSide_moderate', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Extreme)' },
              { value: 10, label: '10 (Moderate)' }
            ]}
          />
        </Box>

        {/* Immoral vs Moral */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_OTHER_SIDE_MORAL_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_MORAL_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_moral}
            onChange={(e, value) => handleSliderChange('otherSide_moral', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Immoral)' },
              { value: 10, label: '10 (Moral)' }
            ]}
          />
        </Box>

        {/* Social Distance - OTHER SIDE */}
        <Typography variant="h6" className={classes.subtitle}>
          {WEEKLY_OTHER_SIDE_SOCIAL_INTRO}
        </Typography>

        {/* Family */}
        <Typography variant="body1" className={classes.question}>
          {WEEKLY_OTHER_SIDE_FAMILY_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_FAMILY_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_family}
            onChange={(e, value) => handleSliderChange('otherSide_family', value)}
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
          {WEEKLY_OTHER_SIDE_FRIEND_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_FRIEND_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_friend}
            onChange={(e, value) => handleSliderChange('otherSide_friend', value)}
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
          {WEEKLY_OTHER_SIDE_COWORKER_QUESTION}
        </Typography>
        <Typography variant="caption" className={classes.scale}>
          {WEEKLY_OTHER_SIDE_COWORKER_SCALE}
        </Typography>
        <Box className={classes.slider}>
          <Slider
            value={surveyData.otherSide_coworker}
            onChange={(e, value) => handleSliderChange('otherSide_coworker', value)}
            min={0}
            max={10}
            valueLabelDisplay="on"
            marks={[
              { value: 0, label: '0 (Very unhappy)' },
              { value: 10, label: '10 (Very happy)' }
            ]}
          />
        </Box>

        {/* Optional Feedback */}
        <Typography variant="h6" className={classes.subtitle}>
          Optional Feedback
        </Typography>
        <TextField
          className={classes.feedbackField}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Would you like to provide any feedback on the study or the website? (Optional)"
          placeholder="Your thoughts, suggestions, or comments..."
          value={surveyData.feedback}
          onChange={handleFeedbackChange}
        />

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleSubmit}
          fullWidth
          disabled={submitted}
        >
          Submit Post-Survey
        </Button>
      </Paper>

      {/* Thank You Dialog with Prolific Code */}
      <Dialog 
        open={thankYouDialogOpen} 
        onClose={handleCloseThankYouDialog}
        aria-labelledby="thank-you-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="thank-you-dialog-title">
          Thank You for Participating!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" gutterBottom>
              Thank you for completing the study! Your responses have been recorded.
            </Typography>
            <Typography variant="body1" gutterBottom style={{marginTop: 16}}>
              <strong>Your Prolific Completion Code:</strong>
            </Typography>
            <Typography 
              variant="h5" 
              style={{
                backgroundColor: '#f0f0f0',
                padding: '12px',
                borderRadius: '4px',
                textAlign: 'center',
                marginTop: 8,
                marginBottom: 16,
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}
            >
              {prolificCode}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please copy this code and paste it into Prolific to receive your payment.
            </Typography>
            <Typography variant="body2" style={{ marginTop: 16, textAlign: 'center' }}>
              <a href={prolificLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: '16px' }}>
                Click here to complete your submission on Prolific
              </a>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseThankYouDialog} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default withStyles(styles)(PostSurveySimplified);
