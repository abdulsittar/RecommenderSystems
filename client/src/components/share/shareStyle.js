import {COLORS} from '../values/colors.js';
export const styles = {
  "share": {
    "width": "100%",
    "borderRadius": "10px",
    "WebkitBoxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
    "boxShadow": "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
    background: COLORS.postBackgroundColor,
    color:COLORS.textColor,
  },
  "shareWrapper": {
    "padding": "20px 5px 20px 5px"
  },
  "shareTop": {
    "display": "flex",
    "alignItems": "center"
  },
  'searchbar': {
    'width': '100%',
    'height': '45px',
    'backgroundColor': COLORS.postBackgroundColor,
    'borderRadius': '30px',
    'display': 'flex',
    'alignItems': 'center'
  },
  'searchIcon': {
    'fontSize': '27px !important',
    'marginLeft': '10px'
  },
  'searchInput': {
    'border': 'none',
    'width': '100%',
    'height': '95%',
    'borderRadius': '30px',
    'background': COLORS.postBackgroundColor,
    color: '#000000 !important',
    '&:focus': {
        outline: 'none'
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
  "shareProfileImg": {
    "width": "50px",
    "height": "40px",
    "borderRadius": "50%",
    "objectFit": "cover",
    "marginRight": "10px"
  },
  "shareInput": {
    "border": "none",
    "width": "100%",
    backgroundColor: COLORS.postBackgroundColor,
    lineHeight:'20px',
    padding:'15px 10px',
    color:COLORS.textColor,
    fontSize:'20px',
    '&:focus': {
        outline: 'none',
    }
  },
  "shareHr": {
    "margin": "20px"
  },
  "shareBottom": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "shareOptions": {
    "display": "flex",
    "marginLeft": "20px"
  },
  "shareOption": {
    "display": "flex",
    "alignItems": "center",
    "marginRight": "15px",
    "cursor": "pointer"
  },
  "shareIcon": {
    "fontSize": "18px",
    "marginRight": "3px"
  },
  "shareOptionText": {
    "fontSize": "14px",
    "fontWeight": "500"
  },
  "shareButton": {
    "border": "none",
    "padding": "10px 15px",
    "borderRadius": "8px",
    "fontWeight": "400",
    "marginRight": "20px",
    "cursor": "pointer",
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
  "shareImgContainer": {
    "padding": "0 20px 10px 20px",
    "position": "relative"
  },
  "shareImg": {
    "width": "100%",
    "objectFit": "cover"
  },
  "shareCancelImg": {
    "position": "absolute",
    "top": "0",
    "right": "20px",
    "cursor": "pointer",
    "opacity": "0.7"
  }
}