import React from 'react';
import { PermMedia, Label, Room, EmojiEmotions, Cancel, Height } from '@material-ui/icons';
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import {styles} from './shareStyle';
import { useMediaQuery } from 'react-responsive';
import InputEmoji from "react-input-emoji";
import SendIcon from '@mui/icons-material/Send';
import { Search } from '@material-ui/icons';
import { What_in_your_mind, Feelings } from '../../constants';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {io} from 'socket.io-client';

function Share({classes}) {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [text, setText] = useState('')
    const desc = useRef();
    const [file, setFile] = useState(null);
    const isMobileDevice = useMediaQuery({ query: "(min-device-width: 480px)", });
    const isTabletDevice = useMediaQuery({ query: "(min-device-width: 768px)", });
    const [socket, setSocket] = useState(null)


    useEffect(() => {
        console.log("setSocket");
        setSocket(io('wss://cleopatra.ijs.si/chat', {
            transports: ['polling'],
            withCredentials: true
          }));
          
        //setSocket(io('http://localhost:8080', {
        //    withCredentials: true, // Include credentials if necessary
        //    transports: [ 'polling'],
        //}
        //)
        //);
        
        const newSocket = io('wss://cleopatra.ijs.si/chat', {
            withCredentials: true, // Include credentials if necessary
            transports: ['polling'], // Fallback to different transports if necessary
        });
        
        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            // You can also access more detailed information from the error object:
            if (error.message) {
                console.error('Error message:', error.message);
            }
            if (error.stack) {
                console.error('Error stack:', error.stack);
            }
            if (error.req) {
                console.error('Error message:', error.req);
            }
            if (error.code) {
                console.error('Error message:', error.code);
            }
            if (error.context) {
                console.error('Error message:', error.context);
            }
            
        });

        newSocket.on('connect_timeout', () => {
            console.error('Connection timeout');
        });

        newSocket.on('error', (error) => {
            console.error('General error:', error);
            // Log more detailed error information
            if (error.message) {
                console.error('Error message:', error.message);
            }
            if (error.stack) {
                console.error('Error stack:', error.stack);
            }
        });
        
    }, [])

    useEffect(() => {
        socket?.emit('addUser', user?.id)
        console.log("active users ")
        socket?.on('getUsers', users => {
            console.log("active users ", users)
        })
    }, [socket])

    // submit a post
    const submitHandler = async (e) => {
        console.log("Submit Handler");
        e.preventDefault();
        const token = localStorage.getItem('token');
        const newPost = {
          userId: user._id,
          desc: text,
          pool:user.pool,
          headers: { 'auth-token': token },
        };
        if (file) {
            
          const data = new FormData();
          const fileName = Date.now() + file.name;
          data.append("name", fileName);
          data.append("file", file);
          newPost.img = fileName;
          //console.log(newPost);
          try {
            await axios.post("/upload", data, {headers: { 'auth-token': token }});
          } catch (err) {}
        }
        try {
        const pst = await axios.post("/posts/" + user._id + "/create", newPost);
        socket.emit('sendMessage', pst);
        setText("");
        
          //await axios.post("/posts/create", newPost);
          // refresh the page after posting something
          //window.location.reload();

        } catch (err) {console.log(err);}
    };

    function handleChange(text) {
        setText(text)
        console.log("enter", text);
      }

      


    return (
        <div className={classes.share}>
            <div className={classes.shareWrapper}>
                <div className={classes.shareTop}>
                    <img
                        className={classes.shareProfileImg}
                        style={{height : (!isMobileDevice && !isTabletDevice)? '50px' : '50px' }}
                        src={
                        user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                        alt=""
                    />
                    <InputEmoji
                        placeholder={What_in_your_mind + user.username + "?"}
                        className={classes.shareInput}
                        value={text}
                        onChange={handleChange}
                        ref={desc}
                    />
                </div>
                <hr className={classes.shareHr}/>
                {file && (
                    <div className={classes.shareImgContainer}>
                        <img className={classes.shareImg} src={URL.createObjectURL(file)} alt="" />
                        <Cancel className={classes.shareCancelImg} onClick={() => setFile(null)} />
                    </div>
                )}
                <form className={classes.shareBottom} onSubmit={submitHandler}>
                    <div className={classes.shareOptions} style={{ height: "0px"}}>
                        <label htmlFor="file" className={classes.shareOption}>
                            <PermMedia htmlColor="tomato" className={classes.shareIcon} style={{ display: "none" }}/>
                            <span className={classes.shareOptionText} style={{ display: "none" }}>Photo or Video</span>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className={classes.shareOption} style={{ display: "none" }}>
                            <Label htmlColor="blue" className={classes.shareIcon}/>
                            <span className={classes.shareOptionText}>Tag</span>
                        </div>
                        <div className={classes.shareOption} style={{ display: "none" }}>
                            <Room  className={classes.shareIcon}/>
                            <span className={classes.shareOptionText}>Location</span>
                        </div>
                        <div className={classes.shareOption} style={{ display: "none" }}>
                            <EmojiEmotions htmlColor="goldenrod" className={classes.shareIcon}/>
                            <span className={classes.shareOptionText}>{"Gefühle"}</span>
                        </div>
                    </div>
                    <Stack direction="row" spacing={2}>
            <Button variant="contained" endIcon={<SendIcon/>} type="submit" onClick={submitHandler}> Send </Button>
            </Stack>
                </form>
            </div>
        </div>
    )
}

export default withStyles(styles)(Share);