import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CodeEditor from "../components/editor/CodeEditor";
import { initSocket } from "../util/socket";
import ACTIONS from "../util/Actions";
import VideoList from "../components/videoChat/VideoList";

import classes from "./EditorPage.module.css";

const EditorPage = () => {
  // eslint-disable-next-line
  const [clients, setClients] = useState([]);

  // We store a ref for code since we dont want the component to re-render on every keystroke which useState will do.
  const codeRef = useRef(null);

  const socketRef = useRef(null);

  const location = useLocation();

  const { roomId } = useParams();

  const [username,setUsername]=useState("");

  const reactNavigator = useNavigate();

  useEffect(() => {
    if (!location.state) {
      return reactNavigator("/", {
        state: {
          roomId: roomId,
        },
      });
    }

    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      setUsername(location.state?.username);

      // LISTINING TO JOINED EVENT
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, sockedId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined`);
          }

          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            joinedSocketId: sockedId,
          });
        }
      );

      // LISTINING TO DISCONNECT EVENT
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);

        setClients((prev) => {
          return prev.filter((client) => client.sockedId !== socketId);
        });
      });
    };
    init();

    // We need to clear the listener else it can lead to memory leak.
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [location, reactNavigator, roomId]);

  const copyRoomID = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://shared-code-editor.netlify.app/editor/${roomId}`
      );
      toast.success("Room link copied!");
    } catch (err) {
      toast.error("Could not copy room link");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  return (
    <>
      <div className={classes.body}>
        <div className={classes.codeEditor}>
          <CodeEditor
            socketRef={socketRef}
            roomId={roomId}
            id="codeEditor"
            fullHeight={true}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
        <div className={classes.videoChat}>
            <VideoList
              socketRef={socketRef}
              currentUsername={username}
            />
        </div>
        {/* <div className={classes.ioEditor}>
          <div className={classes.inputEditor}>
            <TextEditor id="inputEditor" />
          </div>
          <div className={classes.outputEditor}>
            <TextEditor id="outputEditor" />
          </div>
        </div> */}
      </div>
      <div className={classes.footer}>
        <button
          className={`${classes.btn} ${classes.copyBtn}`}
          onClick={copyRoomID}
        >
          Copy Room ID
        </button>
        <button
          className={`${classes.btn} ${classes.leaveBtn}`}
          onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
    </>
  );
};

export default EditorPage;
