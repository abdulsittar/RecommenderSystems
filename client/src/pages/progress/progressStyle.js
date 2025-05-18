import {COLORS} from '../../components/values/colors.js';
export const styles = {
    "profile": {
      "display": "flex",
    },
    "rightbarFollowButton": {
      "marginTop": "30px",
      "marginBottom": "10px",
      "border": "1px solid #4379ed",
      "backgroundColor": COLORS.blueColor,
      transition: 'all .3s ease',
      textTransform: 'uppercase',
      "color": "#111",
      "borderRadius": "10px",
      "padding": "8px 25px",
      "display": "flex",
      "alignItems": "center",
      "fontSize": "16px",
      "fontWeight": "400",
      "cursor": "pointer",
      '&:focus': {
        outline: 'none',
      },
      '&:hover': {
          background: 'transparent',
          color: COLORS.textColor
      }
    },
    "profileRight": {
      "flex": "9",
      background: COLORS.textColor,
      position: 'relative'
    },
    progressHead:{
      fontSize: '14px',
      marginTop: '10px',
      marginBottom: '3vh',
      color: '#444'
    },
    button: {
      width: '100%',
      backgroundColor: '#1b2021',
      marginTop: '5vh',
      height: '50px',
      lineHeight: '50px',
      fontSize: '17px',
      textTransform: 'uppercase',
      letterSpacing: '.6px',
      color: '#dfe2e9',
      cursor: 'pointer',
      textAlign: 'center',    
      appearance: 'none',
      outline: 'none',
      border: 'none',
      transition: 'all .3s ease-in-out',
      '&:hover': {
        backgroundColor: COLORS.blueColor
      }
    },
    progressVal:{
      fontSize: '14px',
      marginTop: '5px',
      marginBottom: '1vh',
      color: '#444'
    },
    "profileCover": {
      "height": "320px",
      "position": "relative"
    },
    "profileCoverImg": {
      "width": "100%",
      "height": "100%",
      "objectFit": "cover"
    },
    "shareInput": {
      "width": "100%",
      backgroundColor: COLORS.postBackgroundColor,
      lineHeight:'16px',
      padding:'15px 10px',
      textColor:COLORS.textColor,
      fontSize:'16px',
      '&:focus': {
          outline: 'none',
      },
      marginBottom: '10px',
      borderWidth: '1px'
    },
    "profileUserImg": {
      "width": "150px",
      "height": "150px",
      "borderRadius": "50%",
      "objectFit": "cover",
      "position": "absolute",
      "left": "0",
      "right": "0",
      "margin": "auto",
      "top": "150px",
    },
    "photosInfo": {
      "display": "flex",
      padding: '0px 0px',
      "flexDirection": "row",
      "alignItems": "center",
      "justifyContent": "center",
      background: COLORS.backgroudColor
    },
    "profileInfo": {
      "display": "flex",
      padding: '30px 0px',
      "flexDirection": "column",
      "alignItems": "center",
      "justifyContent": "center",
      background: COLORS.backgroudColor
    },
    "profileInfoName": {
      "fontSize": "24px",
      background: COLORS.backgroudColor,
      textColor: COLORS.textColor
    },
    "profileInfoDesc": {
      "fontWeight": "400",
      fontSize: '17px',
      color: COLORS.textColor,
      letterSpacing: '.5px',
      marginTop: '5px'
    },
    "profileRightBottom": {
      "display": "flex",
    },
    question:{
      marginBottom: '3vh',
      marginTop: '3vh',
      marginLeft:"1vh",
      fontSize: '12px',
      color: '#444',
      justifyContent: 'left',
      textAlign: 'left',
      fontWeight: '500',
      letterSpacing: '.7px',
    },
    label:{
      marginBottom: '2vh',
      marginTop: '2vh',
      marginLeft:"2vh",
      fontSize: '14px',
      color: '#444',
      justifyContent: 'left',
      textAlign: 'left',
      fontWeight: '500',
      letterSpacing: '.7px',
    },
    label2:{
      marginBottom: '2vh',
      width: '100%',
      marginTop: '2vh',
      marginLeft:"0vh",
      fontSize: '14px',
      color: '#444',
      justifyContent: 'left',
      textAlign: 'left',
      fontWeight: '500',
      letterSpacing: '.7px',
    },
    disclaimor:{
      fontSize: '14px',
      marginTop: '10px',
      marginBottom: '3vh',
      color: '#444',
      fontWeight: '500',
      justifyContent: 'left',
      textAlign: 'left',
      letterSpacing: '.7px',
    },
    secon_disclaimor:{
      fontSize: '14px',
      marginTop: '5px',
      marginBottom: '1vh',
      color: '#444',
      fontWeight: '500',
      justifyContent: 'left',
      textAlign: 'left',
      letterSpacing: '.7px',
    },
    disclaimor2:{
      fontSize: '14px',
      marginTop: '1vh',
      marginBottom: '10px',
      color: '#444',
      fontWeight: '500',
      justifyContent: 'left',
      textAlign: 'left',
      letterSpacing: '.7px',
    },
    disclaimor3:{
      fontSize: '14px',
      marginTop: '3vh',
      marginBottom: '3px',
      color: '#444',
      fontWeight: '500',
      justifyContent: 'left',
      textAlign: 'left',
      letterSpacing: '.7px',
    }
  }