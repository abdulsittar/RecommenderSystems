/* #ff458a' */
import {COLORS} from '../values/colors.js';
export const styles = {
  'topbarContainer': {
    'height': '80px',
    'width': '100%',
    'backgroundColor': COLORS.backgroudColor,
    'alignItems': 'center',
    'position': 'sticky',
    'top': '0',
    'zIndex': '999'
  },
  'topbarLeft': {
    'display': 'flex',
    'flex-direction':  'row',
    'backgroundColor': COLORS.backgroudColor,
    'flex': '4',
    'margin-top': '0px',
    'margin-bottom': '0px'
  },
  'logo': {
    'fontSize': '20px',
    'marginLeft': '5px',
    'fontWeight': 'bold',
    'color': COLORS.textColor,
    'cursor': 'default'
  },
  'topbarCenter': {
    'flex': '7'
  },
  'searchbar': {
    'width': '100%',
    'height': '45px',
    'backgroundColor': COLORS.postBackgroundColor,
    'borderColor': COLORS.textColor, 
    'borderRadius': '30px',
    'display': 'flex',
    'alignItems': 'center',
    lineHeight:'20px',
    padding:'15px 10px',
    color:COLORS.textColor,
    fontSize:'20px',
    '&:focus': {
        outline: 'none',
    }


  },
  'titleAndIcon': {
    'display': 'flex'
  },
  'searchIcon': {
    'fontSize': '27px !important',
    'marginLeft': '10px'
  },
  'homeIcon': {
    'marginLeft': '10px',
    'width': '30px',
    'height': '30px',
    'color': 'white'
  },
  'searchInput': {
    'width': '100%',
    'height': '40px',
    'borderRadius': '30px',
    'background': COLORS.postBackgroundColor,
    color: COLORS.textColor,
    '&:focus': {
        outline: 'none'
    }
  },
  'topbarRight': {
    'alignItems': 'center',
    'justifyContent': 'flex-end',
    'color': COLORS.textColor
  },
  'topbarLink': {
    'marginRight': '15px',
    'fontSize': '14px',
    'cursor': 'default'
  },
  'topbarLink2': {
    'marginRight': '10px',
    'fontSize': '12px',
    'cursor': 'default'
  },
  'topbarIcons': {
    'display': 'flex'
  },
  'topbarIconItem': {
    'marginRight': '15px',
    'cursor': 'default',
    'position': 'relative'
  },
  'topbarIconBadge': {
    'width': '15px',
    'height': '15px',
    'backgroundColor': 'red',
    'borderRadius': '50%',
    'color': 'white',
    'position': 'absolute',
    'top': '-5px',
    'right': '-5px',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'fontSize': '12px'
  },
  userInfo: {
      display: 'flex',
      alignItems: 'center'
  },
  'topbarImg': {
    'width': '32px',
    'height': '32px',
    'borderRadius': '50%',
    'objectFit': 'cover',
    'cursor': 'default',
    marginRight: '10px'
  },
  username: {
      fontSize: '17px',
      marginRight: '5px',
      color: COLORS.textColor
  },
  downArrow: {
      fontSize: '28px',
      color: COLORS.textColor,
      cursor: 'default'
  },
  '@media screen and (max-width: 768px)': {
    '__expression__': 'screen and (max-width: 768px)',
    'topbarLink': {
      'display': 'none'
    }
  }
}




