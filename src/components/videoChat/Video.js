import React, { useEffect, useRef } from "react";

import classes from "./Video.module.css";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
      console.log(stream);
    });
  }, [props.peer]);

  return (
    <li>
      <div className={classes.videoContainer}>
          {/* <Avatar name='Random' size="100%" /> */}
          <video
            autoPlay
            playsInline
            ref={ref}
            className={classes.video}
          />
          <h3 className={classes.videoUsername}>Radnom</h3>
        </div>
    </li>
  );
};

export default Video;
