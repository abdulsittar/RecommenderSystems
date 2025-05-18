import {COLORS} from '../values/colors.js';
export const styles = {
    "post": {
        "width": "100%",
        "borderRadius": "10px",
        "WebkitBoxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
        "boxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
        "margin": "30px 5px",
        background: COLORS.postBackgroundColor
    },
    "commentTop": {
      "display": "flex",
      "flexDirection": "column",
      padding: '0px 0px'
    },
    "postWrapper": {
        "paddingTop": "20px",
        paddingBottom: "20px"
    },
    "shareBottom": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between"
      },
    "postTop": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        padding: '0px 20px'
    },
    "postTopLeft": {
        "display": "flex",
        "alignItems": "center"
    },
    "shareHr": {
        "margin": "2px 20px 2px 20px"
    },
    "postProfileImg": {
        "width": "32px",
        "height": "32px",
        "borderRadius": "50%",
        "objectFit": "cover",
        "cursor": "default"
    },
    "postUsername": {
        "fontSize": "15px",
        "margin": "0 10px",
        'fontWeight': 'bold',
        letterSpacing: '.6px',
        cursor:'default'
    },
    "postDate": {
        "fontSize": "12px"
    },
    postText: {
        padding: '0px 20px',
        margin: '0px 20px',
        color: COLORS.textColor

    },
    "postCenter": {
        "margin": "20px 0"
    },
    "postImg": {
        "marginTop": "20px",
        "width": "100%",
        "maxHeight": "500px",
        "objectFit": "cover"
    },
    "postBottom": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        padding: '0px 20px'
    },
    "dltButton": {
        "border": "none",
        "borderRadius": "8px",
        "fontWeight": "400",
        "marginRight":"15px",
        "marginTop":"5px",
        "cursor": "pointer",
        "align": "align-right",
        "float": "right",
        background: COLORS.blueColor,
        border: '1px solid #4379ed',
        color: '#111',
        transition: 'all .3s ease',
        '&:focus': {
          outline: 'none'
        },
        '&:hover': {
          background: 'transparent',
          color: COLORS.textColor
        }
      },
      "sendButton2": {
        "border": "none",
        "cursor": "pointer",
        "align": "align-right",
        "float": "right",

        transition: 'all .3s ease',
        '&:focus': {
          outline: 'none'
        },
        '&:hover': {
          background: 'transparent',
          color: COLORS.textColor
        }
      },
    "sendButton": {
        "border": "none",
        "borderRadius": "8px",
        "fontWeight": "400",
        "marginRight":"5px",
        "marginTop":"5px",
        "cursor": "pointer",
        "align": "align-right",
        "float": "right",
        border: '1px solid #4379ed',
        color: '#111',
        transition: 'all .3s ease',
        '&:focus': {
          outline: 'none'
        },
        '&:hover': {
          background: 'transparent',
          color: COLORS.textColor
        }
      },
      "smallAvatar": {
        "width": "25px",
        "height": "25px",
        "borderRadius": "50%",
        "objectFit": "cover",
        "marginRight": "0px",
        "alignItems": "flex-start"
      },
    "shareInput": {
        "border": "none",
        backgroundColor: COLORS.postBackgroundColor,
        lineHeight:'20px',
        padding:'0px 0px',
        color: COLORS.textColor,
        fontSize:'12px',
        '&:focus': {
            outline: 'none',
        }
      },
    "postBottom2":{
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        padding: '0px 20px'
    },
    multilineColor:{
        color:'white'
    },
    "postBottomLeft": {
        "display": "flex",
        "alignItems": "center"
    },
    "likeIcon": {
        "width": "24px",
        "height": "24px",
        "margin": "10px",
        "cursor": "pointer",
        transition: 'all 1 ease-in-out',
        '&:hover': {
            transform: 'scale(1.4)'
        }
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
    "postLikeCounter": {
        "fontSize": "15px"
    },
    "postDislikeCounter": {
        "fontSize": "15px"
    },
    "commentLikeCounter": {
      "fontSize": "10px"
  },
  "commentDislikeCounter": {
      "fontSize": "10px"
  },
    "postCommentText": {
        "cursor": "pointer",
        "borderBottom": "1px dashed gray",
        "fontSize": "15px",
        'fontWeight': 'bold',

    },
    "commentText": {
        "backgroundColor": COLORS.postBackgroundColor,
        "padding": "2px",
        "margin": `2px 2px 2px 2px`
      },
    "commentDelete": {
        "fontSize": "1.6em",
        "verticalAlign": "middle",
        "cursor": "pointer"
 },
 "txtnButtonRight": {
     "display": "flex",
     "flexDirection": "column",
     "alignItems": "right",
     },
"commentsWrapper": {
    "padding": "2px",
    backgroundColor: COLORS.commentsBackgroundColor
},
"commentText": {
    "backgroundColor": COLORS.postBackgroundColor,
    "color":"white",
    "padding": "2px",
    "margin": `2px 2px 2px 2px`
  },
"cardHeader": {
    "width":"100%",
    "height": "40px",
    "paddingTop": "0px",
    "paddingBottom": "0px", 
    background: COLORS.postBackgroundColor
  },
  cardHeader2: {
    "paddingTop": "0px",
    "alignItems": "flex-start",
    "paddingBottom": "0px"
  },
}

