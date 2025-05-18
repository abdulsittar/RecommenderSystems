import React, { useState } from 'react';

const Post = ({ post, user, repost, repostUser, webViewUrl }) => {
  const [webViewVisible, setWebViewVisible] = useState(false); // State for controlling popup visibility

  const toggleWebView = () => {
    setWebViewVisible(!webViewVisible); // Toggle visibility of the WebView popup
  };

  return (
    <div className={classes.post} style={{ position: "relative", margin: isDetail && "5px 0", background: repost > 0 ? "#F5F5F5" : "#ffffff" }}>
      <div className={classes.postWrapper} style={{ background: repost > 0 ? "#F5F5F5" : "#ffffff" }}>

        <div className="postContent">
          {/* Your other post content */}

          {/* Button to open the WebView popup */}
          <button onClick={toggleWebView}>Open WebView</button>

        </div>

        {/* WebView Popup */}
        {webViewVisible && (
          <div className="webview-popup">
            <div className="webview-container">
              <iframe
                src={webViewUrl || 'https://www.google.com'} // Replace with dynamic URL if needed
                title="WebView"
                style={{ width: '100%', height: '400px', border: 'none' }}
              />
              <button onClick={toggleWebView}>Close</button> {/* Button to close the popup */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
