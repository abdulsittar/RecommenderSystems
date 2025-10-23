import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    // If uniqueId is provided, use it in the URL path like registration
    const loginUrl = userCredential.uniqueId ? 
      `/auth/login/${userCredential.uniqueId}` : 
      '/auth/login';

    const res = await axios.post(loginUrl, userCredential);
    localStorage.setItem('token', res.data.token);

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
    
    // Return the response data so components can access needsWeeklySurvey
    return res.data;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    throw err; // Re-throw so components can handle the error
  }
};