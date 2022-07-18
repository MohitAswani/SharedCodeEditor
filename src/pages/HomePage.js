import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import classes from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const roomIdLabelRef = useRef();
  const usernameLabelRef = useRef();

  useEffect(() => {
    roomIdLabelRef.current.innerHTML = roomIdLabelRef.current.innerText
      .split("")
      .map((letter, index) => {
        return `<span style="transition-delay:${25 *
          index}ms">${letter}</span>`;
      })
      .join("");

    usernameLabelRef.current.innerHTML = usernameLabelRef.current.innerText
      .split("")
      .map((letter, index) => {
        return `<span style="transition-delay:${25 *
          index}ms">${letter}</span>`;
      })
      .join("");
  }, []);

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  const createNewRoom = (e) => {
    e.preventDefault();

    const id = uuid();

    setRoomId(id);

    toast.success("Created a new room");
  };

  const joinHandler = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Room id & username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username: username,
      },
    });
  };

  const enterHandler = (e) => {
    if (e.code === "Enter") {
      if (!roomId || !username) {
        toast.error("Room id & username is required");
        return;
      }

      navigate(`/editor/${roomId}`, {
        state: {
          username: username,
        },
      });
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.container}>
        <div className={classes.nameLogo}>
          <img src="https://cdn4.iconfinder.com/data/icons/editor-4/32/Editor_Source_Code-512.png" alt="website symbol" />
          <h1>CodeEditor</h1>
        </div>
        <form onSubmit={joinHandler}>
          <div className={classes["form-control"]}>
            <input
              type="text"
              value={roomId}
              onChange={roomIdHandler}
              onKeyUp={enterHandler}
              required
            />
            <label ref={roomIdLabelRef}>Room ID</label>
          </div>
          <div className={classes["form-control"]}>
            <input
              type="password"
              value={username}
              onChange={usernameHandler}
              onKeyUp={enterHandler}
              required
            />
            <label ref={usernameLabelRef}>Username</label>
          </div>

          <button className={`${classes.btn}`}>Join</button>

          <p className={classes.text}>Don't have a room id?&nbsp;</p>
          <a href="/" onClick={createNewRoom}>
            Create room
          </a>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
