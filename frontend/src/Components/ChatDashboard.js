import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Chat from "./Chat";
import { useParams } from "react-router";
import url from "../backendURL";
import axios from "axios";
import SideBar from "./Sidebar";
import { UserContext } from "../App";
import { io } from "socket.io-client";
import notification2 from "../assets/notify2.mp3";

export const SocketContext = createContext();
export const AllUsersContext = createContext();
export const SearchUsersContext = createContext();
export const OnlineUserContext = createContext();
export const ReceiverContext = createContext();
function ChatDashboard() {
    const { user } = useContext(UserContext);
    const { id: receiverId } = useParams();
    const [receiver, setReceiver] = useState([]);
    const [socket, setSocket] = useState();
    const [onlineUsers, setOnlineUsers] = useState();
    const [conversation, setConversation] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState([]);
    const receiverIdRef = useRef(receiverId);

    useEffect(() => {
        receiverIdRef.current = receiverId;
    }, [receiverId]);
    const fetchReceiverDetails = async () => {
        try {
            setChatLoading(true);
            const endpoint = `${url}/api/users/${receiverId}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            const data = await res.data;
            setReceiver(data);
        } catch (e) {
            console.error(e);
        }
        setChatLoading(false);
    };
    const fetchConversation = async () => {
        try {
            setConversation([]);
            const endpoint = `${url}/api/messages/${receiverId}`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            const messages = [];
            for (let i = 0; i < data.length; i++) {
                messages.push({
                    sent: receiverId === data[i]?.receiverId,
                    message: data[i]?.message,
                });
            }
            setConversation(messages);
        } catch (e) {
            console.error(e);
        }
    };
    const fetchUsers = async () => {
        try {
            setUserLoading(true);
            const endpoint = `${url}/api/users`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            if (data) setUsers(data);
        } catch (e) {
            console.error(e);
        }
        setUserLoading(false);
    };
    useEffect(() => {
        if (receiverId) {
            fetchReceiverDetails();
            fetchConversation();
        }
    }, [receiverId]);
    useEffect(() => {
        if (user?._id) {
            const userId = user?._id;
            const socket = io(url, {
                query: {
                    userId,
                },
            });
            setSocket(socket);
            return () => socket.close();
        }
    }, [user]);
    useEffect(() => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
        fetchUsers();
    }, []);
    const sound = new Audio(notification2);
    console.log("sound", sound.readyState, HTMLMediaElement.HAVE_ENOUGH_DATA);
    useEffect(() => {
        socket?.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
        socket?.on("message", ({ senderId, message }) => {
            const currentReceiverId = receiverIdRef.current;
            console.log(senderId, currentReceiverId);

            let notification = new Notification("New Message", {
                body: message,
            });
            if (senderId != currentReceiverId) {
                const sound = new Audio(notification2);
                console.log(sound.readyState);
                sound.play();
                fetchUsers();
            }
        });
        return () => {
            socket?.off("getOnlineUsers");
            socket?.off("message");
        };
    }, [socket]);
    return (
        <SocketContext.Provider value={{ socket }}>
            <AllUsersContext.Provider value={{ users, setUsers }}>
                <SearchUsersContext.Provider
                    value={{ searchUsers, setSearchUsers }}
                >
                    <OnlineUserContext.Provider value={{ onlineUsers }}>
                        <ReceiverContext.Provider
                            value={{ receiver, setReceiver }}
                        >
                            <div className="dashboard">
                                <div className={receiverId && `hide-side-bar`}>
                                    <SideBar
                                        loading={userLoading}
                                        showSearchResult={showSearchResult}
                                        setShowSearchResult={
                                            setShowSearchResult
                                        }
                                        searchUsers={searchUsers}
                                        setSearchUsers={setSearchUsers}
                                    />
                                </div>
                                {receiverId && (
                                    <Chat
                                        conversation={conversation}
                                        setConversation={setConversation}
                                        loading={chatLoading}
                                        showSearchResult={showSearchResult}
                                        setShowSearchResult={
                                            setShowSearchResult
                                        }
                                    />
                                )}
                            </div>
                        </ReceiverContext.Provider>
                    </OnlineUserContext.Provider>
                </SearchUsersContext.Provider>
            </AllUsersContext.Provider>
        </SocketContext.Provider>
    );
}

export default ChatDashboard;
