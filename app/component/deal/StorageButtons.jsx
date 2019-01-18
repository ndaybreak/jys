import React from 'react';
import '@/public/css/storage-buttons.pcss';
import PropTypes from 'prop-types';

class StorageButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onStorageSelected(parseFloat(e.target.textContent) / 100);
    }

    initBtnClassName() {
        let btnNameMap = new Map();
        ['25%', '50%', '75%', '100%'].forEach((value, i) => {
            btnNameMap.set(value, 'storage-btn' + (value == this.props.storagePercent ? "-selected" : ""));
        })
        return btnNameMap;
    }

    render() {
        const btnClassnameMap = this.initBtnClassName();
        const btnClassnameKeys = Array.from(btnClassnameMap.keys());
        const btnItems = btnClassnameKeys.map((key) => {
            return (<span className={btnClassnameMap.get(key)} key={key}
                          onClick={this.handleClick}>{key}</span>);
        });
        return <div className={'btn-container'}>
            {btnItems}
        </div>
    }
}

StorageButtons.defaultProps = {
    storagePercent: ''
}

StorageButtons.prototypes = {
    storagePercent: PropTypes.oneOf(['25%', '50%', '75%', '100%', '']),
    onStorageSelected: PropTypes.func.isRequired
}

export default StorageButtons;

