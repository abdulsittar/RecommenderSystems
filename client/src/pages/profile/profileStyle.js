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
    }
  }