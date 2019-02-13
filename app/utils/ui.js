import React from 'react';
import intl from 'react-intl-universal'
import {Modal, Button} from "antd/lib/index";

function Tip(params={}) {
    if(document.getElementById('davaoTip')) {
        return
    }
    let secondsToGo = params.seconds || 3
    let manualClosed = false
    
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
        maskClosable: true,
        iconType: "none",
        width: (params.width || 209) + "px",
        centered: true,
        content: <Content/>,
        footer: ' ',
        onCancel: () => {
            manualClosed = true
            modal.destroy()
            params.callback && params.callback()
        }
    });
    setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: <Content/>
        });
    }, 1000);
    setTimeout(() => {
        if(!manualClosed) {
            modal.destroy()
            params.callback && params.callback()
        }
    }, secondsToGo * 1000);
}

function Confirm(params={}) {
    Modal.confirm({
        className: 'sto-modal-confirm',
        title: params.msg,
        // content: 'Bla bla ...',
        okText: params.okText || 'Confirm',
        cancelText: params.cancelText || 'Cancel',
        centered: true,
        onOk: () => {
            params.onOk && params.onOk()
        },
        onCancel: () => {
            params.onCancel && params.onCancel()
        }
    });
}

function SimpleConfirm(params={}) {
    const obj = {
        className: 'sto-modal-simple-confirm',
        content: params.msg,
        okText: params.okText || 'Ok',
        cancelText: params.cancelText || 'Cancel',
        centered: true,
        onOk: () => {
            params.onOk && params.onOk()
        }
    }
    if(params.title) {
        obj.title = params.title
    }

    Modal.confirm(obj);
}

const ui = {
    tip: Tip,
    confirm: Confirm,
    simpleConfirm: SimpleConfirm
}

export { ui }