import {COLORS} from '../values/colors.js';
export const styles = {
  "sidebar": {
    //"flex": "2",
    "height": "calc(100vh - 80px)",
    "overflowY": "scroll",
    "position": "sticky",
    "top": "50px",
    background: COLORS.backgroudColor,
  },
  "rightbarTitle": {
      "fontSize": "18px",
      textTransform: 'uppercase',
      "fontWeight": "500",
      "margin": "30px 0px",
      'fontWeight': 'bold'
    },
  "sidebarWrapper": {
    background: COLORS.backgroudColor,
    color: COLORS.textColor,
    "padding": "20px",
  },
  "sidebarList": {
    "padding": "0",
    "margin": "0",
    "listStyle": "none"
  },
  "sidebarListItem": {
    "display": "flex",
    "alignItems": "center",
    "marginBottom": "20px"
  },
  "sidebarIcon": {
    "marginRight": "15px",
    color: COLORS.blueColor
  },
  "sidebarButton": {
    "width": "150px",
    "border": "none",
    "padding": "15px 25px",
    "borderRadius": "10px",
    "fontWeight": "400",
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '.4px',
    background: COLORS.blueColor,
    cursor: 'pointer',
    border: '1px solid #4379ed',
    transition: 'all .3s ease',
    '&:hover': {
      background: 'transparent',
      color: COLORS.textColor,
    }
  },
  "sidebarHr": {
    "margin": "20px 0",
    backgroundColor: COLORS.blueColor,
    height: '1px'
  },
  "sidebarFriendList": {
    "padding": "0",
    "margin": "0",
    "listStyle": "none"
  },
  "sidebarFriend": {
    "display": "flex",
    "alignItems": "center",
    "marginBottom": "15px"
  },
  "sidebarFriendImg": {
    "width": "32px",
    "height": "32px",
    "borderRadius": "50%",
    "objectFit": "cover",
    "marginRight": "10px"
  }
}

