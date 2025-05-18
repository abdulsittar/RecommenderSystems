import {COLORS} from '../../components/values/colors.js';
export const styles = {
    register: {
		height: 'auto',
		width: '100%',
		position: 'relative',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'auto',
		scrollY:'auto'
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
    form: {
        width: '400px',
		minWidth: '250px',
		textAlign: 'center'
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
	secon_disclaimor4:{
		fontSize: '14px',
		marginTop: '5px',
		marginBottom: '4vh',
		color: '#444',
		fontWeight: '500',
		justifyContent: 'left',
		textAlign: 'left',
		letterSpacing: '.7px',
	},
	secon_disclaimor5:{
		fontSize: '14px',
		marginTop: '1vh',
		marginBottom: '4vh',
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
	},
    text: {
		fontSize: '14px',
		marginTop: '30px',
		marginBottom: '6vh',
		color: '#444',
		fontWeight: '500',
		textTransform: 'uppercase',
		letterSpacing: '.7px',
		'& a': {
			textDecoration: 'none',
			fontSize: '14px',
			color: COLORS.blueColor,
			fontWeight: '500',
			textTransform: 'uppercase',
			letterSpacing: '.7px',
		}
	},
    avatar: {
        width: '150px',
        height: '150px',
        marginLeft: '50%',
        transform: 'translateX(-50%)'
    },
	textField: {
		width: '100%',
		marginTop: '40px',	
	},
	textField3: {
		width: '100%',
		marginTop: '40px',	
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
	errorMessage: {
		textAlign: 'left',
		fontSize: '12px',
		color: 'red',	
		marginTop: '5px'
	},
	success: {
		width: '400px',
		minWidth: '250px',
		textAlign: 'center'
	},
	top: {
		display: 'block',
		textAlign: 'center',
		padding: '40px 10px',
		borderTopLeftRadius: '10px',
		borderTopRightRadius: '10px',
		background: '#8bc34a'
	},
	bottom: {
		textAlign: 'center',
		padding: '40px 40px',
		borderBottomLeftRadius: '10px',
		borderBottomRightRadius: '10px',
		background: '#EEE'
	},
	successText: {
		color: COLORS.textColor,
		fontSize: '23px',
		letterSpacing: '1.3px',
		marginTop: '15px',
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	descriptionText: {
		lineHeight: '28px',
		fontSize: '17px',
		color: '#757575',
		width: '400px',
		minWidth: '100px',

	}
}
