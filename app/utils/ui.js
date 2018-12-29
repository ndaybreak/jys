import React from 'react';
import intl from 'react-intl-universal'
import {Modal, Button} from "antd/lib/index";

function Tip(params={}) {
    if(document.getElementById('davaoTip')) {
        return
    }
    let secondsToGo = params.seconds || 3;
    function Content() {
        return (
            <div id="davaoTip">
                <div className="tip-success-label">{params.msg}</div>
                <div className="tip-success-time">{secondsToGo} s</div>
            </div>
        )
    }
    const modal = Modal.success({
        className: 'tip-success',
        iconType: "none",
        width: (params.width || 209) + "px",
        style:{top: 250},
        content: <Content/>,
        footer: ' '
    });
    setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: <Content/>
    });
    }, 1000);
    setTimeout(() => {
        modal.destroy()
        params.callback && params.callback()
    }, secondsToGo * 1000);
}


const ui = {
    tip: Tip
}

export { ui }