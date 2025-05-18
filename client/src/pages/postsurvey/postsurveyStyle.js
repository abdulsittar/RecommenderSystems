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
      fontSize: '3rem',
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
      display: 'inline-block',
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
    },
    scaleLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#666',
      marginTop: '4px',
      fontStyle: 'italic',
    },
    rightLabel: {
      textAlign: 'right',
    },
    leftScaleLabel: {
      textAlign: 'right',
      fontStyle: 'italic',
      fontSize: '13px',
      color: '#555',
      paddingRight: '10px',
      width: '150px',
    },
    rightScaleLabel: {
      textAlign: 'left',
      fontStyle: 'italic',
      fontSize: '13px',
      color: '#555',
      paddingLeft: '10px',
      width: '150px',
    },
    questionHeader: {
      fontWeight: 'bold',
      fontSize: '14px',
      padding: '15px',
      backgroundColor: '#f8f8f8',
      borderBottom: '2px solid #ddd',
    },
    // Update the tableContainer style
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      marginTop: '20px',
      marginBottom: '20px',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },

    // Update the questionTable style
    questionTable: {
      width: '100%',
      borderCollapse: 'collapse',
      '& th, & td': {
        padding: '12px 8px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
      },
      '& th': {
        backgroundColor: '#f7f7f7',
        fontWeight: 'bold',
      },
      '& td:first-child': {
        textAlign: 'left',
        fontWeight: '500',
        maxWidth: '250px',
        padding: '12px 15px',
      },
      '& tr:hover': {
        backgroundColor: '#f9f9f9',
      },
      '& tfoot tr td': {
        borderBottom: 'none',
        paddingTop: '10px',
      },
      '& input[type="radio"]': {
        cursor: 'pointer',
        transform: 'scale(1.2)',
      }
    },

    // Enhance the scaleLabels style
    scaleLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      color: '#555',
      marginTop: '4px',
      fontWeight: '500',
    }
  }