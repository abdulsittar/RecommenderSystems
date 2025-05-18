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
    feed: {
      background: COLORS.backgroudColor,
      paddingLeft: '5px',
    paddingRight: '5px',
    paddingBottom: '5px',
  },
  feedWrapper: {
    //paddingLeft: '10px',
    //paddingRight: '10px',
    //paddingBottom: '10px',
    background: COLORS.backgroudColor,
    color: COLORS.textColor,
    padding: '10px 250px 0px 250px',
        '@media (max-width: 768px)': {
              // No padding on mobile screens
              padding: '10px',
        },
},
    "profileRight": {
      "flex": "9",
      background: COLORS.textColor,
      position: 'relative'
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
      "border": "none",
      "width": "100%",
      backgroundColor: COLORS.postBackgroundColor,
      lineHeight:'16px',
      padding:'15px 10px',
      color:COLORS.textColor,
      fontSize:'16px',
      '&:focus': {
          outline: 'none',
      }
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
      background: COLORS.textColor
    },
    "profileInfo": {
      "display": "flex",
      padding: '30px 0px',
      "flexDirection": "column",
      "alignItems": "center",
      "justifyContent": "center",
      background: COLORS.textColor
    },
    "profileInfoName": {
      "fontSize": "24px",
      color: COLORS.textColor
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
    }
  }