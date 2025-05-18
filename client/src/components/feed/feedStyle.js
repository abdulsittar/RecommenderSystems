import {COLORS} from '../values/colors.js';
export const styles = {
    feed: {
        flex: '5.5',
        background: COLORS.backgroudColor,
    },
    feedWrapper: {
        
        padding: '10px 250px 0px 250px',
        '@media (max-width: 768px)': {
              // No padding on mobile screens
              padding: '10px',
        },
        background: COLORS.backgroudColor,
        color: COLORS.textColor,
    }
}

