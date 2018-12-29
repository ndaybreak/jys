import React from 'react';
import rightBtn from '@/public/img/右箭头-up.png'
import rightBtnOver from '@/public/img/右箭头-over.png'

class NextArrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rightBtn: rightBtn
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    rightBtnEnter() {
        this.setState({
            rightBtn: rightBtnOver
        })
    }
    rightBtnLeave() {
        this.setState({
            rightBtn: rightBtn
        })
    }

    render() {
        const {onClick} = this.props
        return (
            <span className="tai-slick-next">
                <img className="btn-right" src={this.state.rightBtn} alt="" onClick={onClick}
                     onMouseEnter={this.rightBtnEnter.bind(this)} onMouseLeave={this.rightBtnLeave.bind(this)}/>
            </span>
        );
    }
}

export default NextArrow