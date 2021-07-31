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
import { v4 as uuidv4 } from "uuid";
import { ChatItem } from 'react-chat-elements';

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
                        createdAt: common.formatTimeChat(new Date(res.time)),
                        imageUrl: "/static/assets/img/avatar-person.svg"
                    },
                    isMyMessage: res.typeFrom === "Seller"
                }])
            });
        }
    }, [socket]);

    const getAvatar = (conversation) => {
        const { recipients } = conversation;
        const { to } = recipients;
        const { toId } = to;
        const { imageUrl } = toId;
        if (imageUrl) {
            const { url } = imageUrl;
            return url || "/static/assets/img/avatar-person.svg";
        };

        return "/static/assets/img/avatar-person.svg";
    };

    const getListConversation = async () => {
        try {
            const response = await api.chat.getListConversation();
            if (response.data.code === 200) {
                const { result } = response.data;
                const conversations = [];
                result.forEach((conversation) => {
                    const { recipients } = conversation;
                    const { from, to } = recipients;
                    const { fromId } = from;
                    const { toId } = to;
                    const checkSeller = from.actors === "Seller";
                    let title = checkSeller ? toId.name : fromId.name;
                    let fromUserId = checkSeller ? fromId._id : toId._id;
                    let toUserId = checkSeller ? toId._id : fromId._id;
                    conversations.push({
                        fromUserId,
                        toUserId,
                        avatar: getAvatar(conversation),
                        alt: "avatar",
                        title,
                        subtitle: conversation.lastMessage,
                        dateString: common.formatTimeChat(new Date(conversation.date)),
                        unread: conversation.count,
                        className: ""
                    })
                });
                setListConversation(conversations);
                setChatUserId(conversations[0].toUserId);
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
                    const { to, body, date } = message;
                    const { typeTo, idTo } = to;
                    const { imageUrl } = idTo;
                    messages.push({
                        message: {
                            messageText: body,
                            createdAt: common.formatTimeChat(new Date(date)),
                            imageUrl: imageUrl ? (imageUrl.url || "/static/assets/img/avatar-person.svg") : "/static/assets/img/avatar-person.svg"
                        },
                        isMyMessage: typeTo === "Seller"
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
        if (!_.isEmpty(auth)) {
            getListConversation();
        }
    }, [auth]);

    useEffect(() => {
        if (chatUserId) {
            getListMessage(chatUserId);
        }
    }, [chatUserId]);

    const onClickConversation = async (conversation) => {
        try {
            const { toUserId, unread } = conversation;
            if (unread) {
                const response = await api.chat.updateMessage(toUserId);
                if (response.data.code === 200) {
                    const newConversation = listConversation.map(
                        (conversation) => {
                            if (conversation.toUserId === chatUserId) {
                                return ({
                                    ...conversation,
                                    unread: 0
                                });
                            }
                            return conversation;
                        }
                    );
                    setListConversation(newConversation);
                } else {
                    common.ToastPrime("Lỗi",
                        response.data.message,
                        "error",
                        toast
                    );
                }
            }
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    }

    const updateMessage = async () => {
        const conversation = listConversation.find((item) => item.toUserId === chatUserId);
        if (conversation) {
            try {
                const { toUserId, unread } = conversation;
                if (unread) {
                    const response = await api.chat.updateMessage(toUserId);
                    if (response.data.code === 200) {
                        const newConversation = listConversation.map(
                            (conversation) => {
                                if (conversation.toUserId === chatUserId) {
                                    return ({
                                        ...conversation,
                                        unread: 0
                                    });
                                }
                                return conversation;
                            }
                        );
                        setListConversation(newConversation);
                    } else {
                        common.ToastPrime("Lỗi",
                            response.data.message,
                            "error",
                            toast
                        );
                    }
                }
            } catch (error) {
                common.ToastPrime("Lỗi",
                    error.response ? error.response.data.message : error.message,
                    "error",
                    toast
                );
            }
        }
    }

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
                        {
                            listConversation.map((conversation) => (
                                <ChatItem
                                    key={uuidv4()}
                                    avatar={conversation.avatar}
                                    alt={conversation.alt}
                                    title={conversation.title}
                                    subtitle={conversation.subtitle}
                                    dateString={conversation.dateString}
                                    unread={conversation.unread}
                                    onClick={() => onClickConversation(conversation)}
                                    className={conversation.className}
                                />
                            ))
                        }
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
                                onFocus={() => updateMessage()}
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
