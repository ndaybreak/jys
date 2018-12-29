import React from 'react';
import leftBtn from '@/public/img/左箭头-up.png'
import leftBtnOver from '@/public/img/左箭头-over.png'

class PrevArrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftBtn: leftBtn
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    leftBtnEnter() {
        this.setState({
            leftBtn: leftBtnOver
        })
    }
    leftBtnLeave() {
        this.setState({
            leftBtn: leftBtn
        })
    }

    render() {
        const {onClick} = this.props
        return (
            <span className="tai-slick-prev">
                <img className="btn-left" src={this.state.leftBtn} alt="" onClick={onClick}
                     onMouseEnter={this.leftBtnEnter.bind(this)} onMouseLeave={this.leftBtnLeave.bind(this)}/>
            </span>
        );
    }
}

export default PrevArrow