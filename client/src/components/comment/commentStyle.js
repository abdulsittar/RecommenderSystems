import {COLORS} from '../values/colors.js';
export const styles = {
  "comment": {
    "width": "100%",
    "borderRadius": "10px",
    "WebkitBoxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
    "boxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
    "margin": "0px 0",
    background: COLORS.commentsBackgroundColor
    
},
    cardHeader: {
      "paddingTop": "5px",
      "paddingBottom": "5px"
    },
    commentField: {
      "width": '96%'
    },
    "postBottom": {
      "display": "flex",
      "alignItems": "center",
      "justifyContent": "space-between",
      padding: '0px 20px'
  },
  "postBottomLeft": {
    "display": "flex",
    "alignItems": "center"
},
"commentLikeCounter": {
  "fontSize": "10px"
},
"postDate": {
  "fontSize": "12px",
  "textColor": COLORS.textColor
},
"commentLikeIcon": {
  "width": "24px",
  "height": "24px",
  "margin": "10px",
  "cursor": "pointer",
  transition: 'all 1 ease-in-out',
  '&:hover': {
      transform: 'scale(1.4)'
  }
},
    "smallAvatar": {
      "width": "25px",
      "height": "25px",
      "borderRadius": "50%",
      "objectFit": "cover",
      "marginRight": "0px",
      "alignItems": "flex-start",
      "cursor":"default"
    },
    "commentText": {
      "backgroundColor": COLORS.postBackgroundColor,
      textColor:COLORS.textColor,
    },
    commentDate: {
      "display": 'block',
      "color": 'gray',
      "fontSize": '0.8em'
   },
   cardHeader2: {
    "marginTop": "10px",
    "paddingTop": "0px",
    "alignItems": "flex-start",
    "paddingBottom": "0px",
    "display": "flex",
    "alignItems": "flex-start",
  },
   commentDelete: {
     "fontSize": '1.6em',
     "verticalAlign": 'middle',
     "cursor": 'pointer'
   }
  }