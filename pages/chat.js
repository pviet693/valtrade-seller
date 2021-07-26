import Head from 'next/head';
import LoadingBar from "react-top-loading-bar";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common.utils';
import cookie from "cookie";
import * as validate from './../utils/validate.utils';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { ChatList } from 'react-chat-elements';
import Message from "../components/Message";
import { DataContext } from '../store/GlobalState';
import _ from "lodash";

const Chat = ({ shopInfo }) => {
    const { state, socket} = useContext(DataContext);
    const { auth } = state
    const [messageText, setMessageText] = useState("");
    const [listMessage, setListMessage] = useState([]);
    const [listConversation, setListConversation] = useState([]);
    const [chatUserId, setChatUserId] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (listMessage.length > 0) {
            scrollToBottom();
        }
    }, [listMessage]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = messageText;
        setMessageText("");
        try {
            let body = {
                typeFrom: "Seller",
                typeTo: "Buyer",
                to: chatUserId,
                message: text
            }
            const response = await api.chat.postMessage(body);
            if (response.status !== 200) {
                common.Toast(response.data.message, "error");
            }
        } catch (error) {
            common.Toast(error.response ? error.response.data.message : error.message, "error");
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("messages", (res) => {
                setListMessage((prevStates) => [...prevStates, {
                    message: {
                        messageText: res.message,
                        createdAt: res.time,
                        imageUrl: "/static/avatar-person.svg"
                    },
                    isMyMessage: res.typeFrom === "Buyer"
                }])
            });
        }
    }, [socket]);

    const getAvatar = (conversation) => {
        const { recipients } = conversation;
        const { from } = recipients;
        const { fromId } = from;
        const { imageUrl } = fromId;
        if (imageUrl) {
            const { url } = imageUrl;
            return url || "/static/avatar-person.svg";
        };

        return "/static/avatar-person.svg";
    };

    const getListConversation = async () => {
        try {
            const response = await api.chat.getListConversation();
            console.log(response);
            if (response.data.code === 200) {
                const { result } = response.data;
                const conversations = [];
                result.forEach((conversation, index) => {
                    if (index === 0) {
                        const { recipients } = conversation;
                        const { to } = recipients;
                        const { toId } = to;
                        setChatUserId(toId._id);
                    }
                    conversations.push({
                        avatar: getAvatar(conversation),
                        alt: "avatar",
                        title: conversation.recipients.from.fromId.name || "",
                        subtitle: conversation.lastMessage,
                        dateString: conversation.date,
                        unread: conversation.count,
                    })
                });
                setListConversation(conversations);
            } else {
                common.Toast(response.data.message, "error");
            }
        } catch (error) {
            common.Toast(error.response ? error.response.data.message : error.message, "error");
        }
    }

    const getListMessage = async (chatUserId) => {
        try {
            const response = await api.chat.getListMessage(chatUserId);
            if (response.data.code === 200) {
                const { result } = response.data;
                const messages = [];
                result.forEach((message) => {
                    const { from, body, date } = message;
                    const { typeTo } = from;
                    messages.push({
                        message: {
                            messageText: body,
                            createdAt: date,
                            imageUrl: "/static/avatar-person.svg"
                        },
                        isMyMessage: typeTo === "Buyer"
                    })
                });
                setListMessage(messages);
            } else {
                common.Toast(response.data.message, "error");
            }
        } catch (error) {
            common.Toast(error.response ? error.response.data.message : error.message, "error");
        }
    };

    useEffect(() => {
        // if (!_.isEmpty(auth)) {
            getListConversation();
        // }
    }, [auth]);

    useEffect(() => {
        // if (chatUserId) {
        getListMessage("60817365be8a2f0cba7f7640");
        // }
    }, [chatUserId]);

    return (
        <div className="shop">
            <Head>
                <title>Chăm sóc khách hàng</title>
            </Head>
            <div className="shop-container">
                <div className="title">
                    Chăm sóc khách hàng
                </div>
                <hr />
                <div className="d-flex w-100">
                    <div className="col-lg-4 px-0 h-100"
                        style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.09)",
                            minHeight: 500
                        }}
                    >
                        <ChatList
                            className='chat-list'
                            dataSource={listConversation} />
                    </div>
                    <div className="col-lg-8 px-0 h-100" style={{ position: "relative", minHeight: "500px" }}>
                        <div style={{ height: 440, overflow: "auto", padding: 10, marginBottom: 10 }}>
                            
                            {
                                listMessage.map((message) => {
                                    return (
                                        <Message
                                            key={uuidv4()}
                                            isMyMessage={message.isMyMessage}
                                            message={message.message}
                                        />
                                    );
                                })
                            }
                            <div ref={messagesEndRef} />
                        </div>
                        <form
                            className="chat-form"
                        >
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tin nhắn ở đây..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn"
                                onClick={sendMessage}
                                style={{
                                    boxShadow: "unset",
                                    background: "#fff"
                                }}
                            >
                                <img src="/static/assets/img/send-message.png" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.headers.cookie;
    let shopInfo = {};
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.shop.getInfoStore(token);

                if (res.data.code === 200) {
                    const result = res.data.result;
                    shopInfo.id = result._id || "";
                    shopInfo.nameShop = result.nameShop || "";
                    shopInfo.phone = result.phone || "";
                    shopInfo.address = result.address || "";
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: {
                    shopInfo
                }
            }
        }
        else {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            }
        }
    } else {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }
}

export default Chat;
