import { toast } from "react-toastify";

const showToast = (type, msg) => {
    return toast[type](msg, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: 0,
    });
}

export default showToast;