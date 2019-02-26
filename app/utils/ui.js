import React from 'react'
import ReactDOM from 'react-dom'
import intl from 'react-intl-universal'
import {Modal, Button, Spin} from "antd/lib/index"

function Tip(params = {}) {
    if (document.getElementById('davaoTip')) {
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
            clearInterval(interval)
            params.callback && params.callback()
        }
    });
    let interval = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: <Content/>
        });
    }, 1000);
    setTimeout(() => {
        if (!manualClosed) {
            modal.destroy()
            params.callback && params.callback()
        }
    }, secondsToGo * 1000);
}

function Confirm(params = {}) {
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

function SimpleConfirm(params = {}) {
    function Content() {
        return (
            <div dangerouslySetInnerHTML={{__html: params.msg}}></div>
        )
    }

    const obj = {
        className: 'sto-modal-simple-confirm',
        content: <Content/>,
        width: params.width || 416,
        okText: params.okText || 'OK',
        cancelText: params.cancelText || 'Cancel',
        centered: true,
        onOk: () => {
            params.onOk && params.onOk()
        }
    }

    function Title() {
        return (
            <div dangerouslySetInnerHTML={{__html: params.title}}></div>
        )
    }

    if (params.title) {
        obj.title = <Title/>
    }

    Modal.confirm(obj);
}

function Loading(type) {
    if(type === 'hide') {
        let loading = document.getElementById('stoxLoading')
        loading && loading.parentNode.removeChild(loading)
    } else {
        if(document.getElementById('stoxLoading')) {
            return
        }
        const popup = document.createElement("div")
        popup.id = 'stoxLoading'
        popup.classList.add('sto-loading-wrap')
        document.body.appendChild(popup)
        ReactDOM.render(<Spin/>, popup)
    }
}

const ui = {
    tip: Tip,
    confirm: Confirm,
    simpleConfirm: SimpleConfirm,
    loading: Loading
}

export {ui}