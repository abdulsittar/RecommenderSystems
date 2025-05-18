import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: '2rem',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#6200ea',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#3700b3',
    },
  },
}));
