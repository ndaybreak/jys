import React from 'react'
import 'antd/lib/icon/style/css'
import '../../public/css/common.pcss'

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="a-breadcrumb">
                {this.props.data.map((item, index) => {
                    return (
                        <span key={'breadcrumb_' + index}>
                            {item.path && (
                                <a className="link" href={item.path}>{item.val}</a>
                            )}
                            {!item.path && (
                                <span className="label">{item.val}</span>
                            )}
                            {index !== (this.props.data.length - 1) && (
                                <span className="separator">></span>
                            )}
                        </span>
                    )
                })}
            </div>
        );
    }
}

export default Header