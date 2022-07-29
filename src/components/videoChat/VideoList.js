import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import Peer from "simple-peer";

import Video from "./Video";
import ACTIONS from "../../util/Actions";

import classes from "./VideoList.module.css";

const videoConstraints = {
  height: window.innerHeight / 8,
  width: window.innerWidth / 8,
};

const VideoList = ({ socketRef, currentUsername }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  const socketRefCurr = socketRef.current;

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });

      userVideo.current.srcObject = stream;

      if (socketRefCurr) {
        socketRefCurr.on(ACTIONS.ALL_USERS, (clients) => {
          const peers = [];

          clients.forEach((client) => {
            const peer = createPeer(client.socketId, socketRefCurr.id, stream);
            peersRef.current.push({
              peerID: client.sockedId,
              peer,
            });

            peers.push(peer);
            setPeers(peers);
          });
        });

        socketRefCurr.on(ACTIONS.RTC_USER_JOINED, (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRefCurr.on(ACTIONS.RECEIVE_RETURNED_SIGNAL, (payload) => {
          const item = peersRef.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      }
    };

    init();

    const createPeer = (userToSignal, callerId, stream) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on(ACTIONS.SIGNAL, (signal) => {
        socketRefCurr.emit(ACTIONS.SENDING_SIGNAL, {
          userToSignal,
          callerId,
          signal,
        });
      });

      return peer;
    };

    const addPeer = (incomingSignal, callerID, stream) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on(ACTIONS.SIGNAL, (signal) => {
        socketRefCurr.emit(ACTIONS.RETURNING_SIGNAL, { signal, callerID });
      });

      peer.signal(incomingSignal);

      return peer;
    };

    return () => {
      if (socketRefCurr) {
        socketRefCurr.off(ACTIONS.ALL_USERS);
      }
    };
  }, [socketRefCurr]);

  return (
    <ul className={classes.videoList}>
      <li>
        <div className={classes.videoContainer}>
          <Avatar name={currentUsername} size="100%" />
          <video
            muted
            autoPlay
            playsInline
            ref={userVideo}
            className={classes.video}
          />
          <h3 className={classes.videoUsername}>{currentUsername}</h3>
        </div>
      </li>
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
    </ul>
  );
};

export default VideoList;
