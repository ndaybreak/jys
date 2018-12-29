import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/component/common/App';
import Index from '../app/component/validate-code/Index.jsx';
ReactDOM.render(<App page={Index} />,document.getElementById('app'));