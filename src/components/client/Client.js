import React from "react";
import Avatar from "react-avatar";

import classes from "./Client.module.css";

const Client = ({ username }) => {
  return (
    <div className={classes.client} size={50} round="14px">
      <Avatar name={username} />
      <span className={classes.username}>{username}</span>
    </div>
  );
};

export default Client;
