import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Chat from "../Chats/Chat";
import { useParams } from "react-router";
import url from "../../backendURL";
import axios from "axios";
import SideBar from "./Sidebar";
import { UserContext } from "../../App";
import { io } from "socket.io-client";
import { formatDate } from "../../HelperFunctions/formatDate";
import Welcome from "../Utils/Welcome";

export const SocketContext = createContext();
export const AllUsersContext = createContext();
export const SearchUsersContext = createContext();
export const OnlineUserContext = createContext();
export const ReceiverContext = createContext();
function Dashboard() {
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
    const [usersLoading, setUsersLoading] = useState(false);
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
            setChatLoading(true);
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
                    time: formatDate(data[i]?.createdAt),
                });
            }
            setConversation(messages);
        } catch (e) {
            console.error(e);
        }
        setChatLoading(false);
    };
    const fetchUsers = async () => {
        try {
            // setUsersLoading(true);
            const endpoint = `${url}/api/users`;
            const res = await axios.get(`${endpoint}`, {
                withCredentials: true,
            });
            let data = await res.data;
            if (data) setUsers(data);
        } catch (e) {
            console.error(e);
        }
        setUsersLoading(false);
    };
    useEffect(() => {
        fetchUsers();
    }, []);
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
        socket?.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
        socket?.on("newMessage", () => {
            fetchUsers();
        });
        return () => {
            socket?.off("getOnlineUsers");
            socket?.off("message");
            socket?.off("newMessage");
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
                                        usersLoading={usersLoading}
                                        showSearchResult={showSearchResult}
                                        setShowSearchResult={
                                            setShowSearchResult
                                        }
                                        searchUsers={searchUsers}
                                        setSearchUsers={setSearchUsers}
                                    />
                                </div>
                                {receiverId ? (
                                    <Chat
                                        conversation={conversation}
                                        setConversation={setConversation}
                                        chatLoading={chatLoading}
                                        showSearchResult={showSearchResult}
                                        setShowSearchResult={
                                            setShowSearchResult
                                        }
                                    />
                                ) : (
                                    <Welcome msg={`Hello`} />
                                )}
                            </div>
                        </ReceiverContext.Provider>
                    </OnlineUserContext.Provider>
                </SearchUsersContext.Provider>
            </AllUsersContext.Provider>
        </SocketContext.Provider>
    );
}

export default Dashboard;
