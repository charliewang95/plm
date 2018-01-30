import React from 'react';
import ReactDOM from 'react-dom';
import App from './frontend/components/App/App.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
