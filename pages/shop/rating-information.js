import Head from "next/head";
import { useEffect, useState } from "react";
import Rating from "../../components/Rating"
import api from "../../utils/backend-api.utils";
import * as common from './../../utils/common.utils';

const ratingInformation = () => {
    const [comments, setComments] = useState([]);

    const getRatings = async() => {
        try{
            const res = await api.rating.getList();
            if (res.status === 200){
                if (res.data.code === 200){
                    let listComment = [];
                    res.data.result.map(x => {
                        let comment = {};
                        comment.buyerRate = x.buyerRate.name || "";
                        comment.rate = x.rate || "";
                        comment.comment = x.comment || "";
                        comment.createTime = x.createTime || "";
                        comment.imageUrl = x.buyerRate.imageUrl? x.buyerRate.imageUrl.url : "/static/avatar2.png";
                        listComment.push(comment);
                    });
                    setComments(() => listComment);
                }
                else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        }catch(err){
            console.log(err);
        }
    }
    
    useEffect(() =>{
        getRatings();
    },[]);

    return (
        <div>
            <Head>
                <title>
                    Đánh giá shop
                </title>
            </Head>
            <div className="comment-container">
                {
                    comments.map(x => (
                        <div key={x.createTime}>
                            <Rating imageUrl={x.imageUrl} name={x.buyerRate} comment={x.comment} rate={x.rate} createTime={x.createTime}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ratingInformation
