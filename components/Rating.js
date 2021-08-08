import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Moment from 'moment';
Moment.locale('en');

const RatingComponent = ({imageUrl, name, comment, rate, createTime}) => {
    return (
        <div className="comment-row">
            <div className="comment-row_img">
                <img src={imageUrl} alt="Avatar" />
            </div>
            <div className="comment-row_content">
                <div className="content_name">
                    {name}
                </div>
                <Rating
                    disabled={true}
                    name="customized-empty"
                    defaultValue={rate / 20}
                    precision={0.5}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    size="large"
                />
                <div className="dialog-box">
                    <div className="dialog-box__body">
                        <span className="tip tip-up"></span>
                        <div className="message">
                            <span>{comment}</span>
                        </div>
                    </div>
                </div>
                <div className="comment-time">
                    {Moment(new Date(createTime)).format("DD/MM/yyyy HH:mm:ss A")}
                </div>    
            </div>
        </div>
    )
}

export default RatingComponent
