import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import ClientRoom from "./components/Clientroom";
import JoinCreateRoom from "./components/JoinCreateRoom";
import Room from "./components/Room";
import Sidebar from "./components/Sidebar";
import "./style.css";

const server = "https://insync-harmony-backend.onrender.com/";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  useEffect(() => {
    if (roomJoined) {
      socket.emit("user-joined", user);
    }
  }, [roomJoined]);

  return (
    <div className="home">
      <ToastContainer />
      {roomJoined ? (
        <>
          <Sidebar users={users} user={user} socket={socket} />
          {user.presenter ? (
            <Room
              userNo={userNo}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNo={setUserNo}
            />
          ) : (
            <ClientRoom
              userNo={userNo}
              user={user}
              socket={socket}
              setUsers={setUsers}
              setUserNo={setUserNo}
            />
          )}
        </>
      ) : (
        <JoinCreateRoom
          uuid={uuid}
          setRoomJoined={setRoomJoined}
          setUser={setUser}
        />
      )}
    </div>
  );
};
export default App;
