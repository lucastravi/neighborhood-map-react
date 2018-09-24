import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { locations } from './data/mapLocations';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App locations={locations}/>, document.getElementById('root'));
registerServiceWorker();
