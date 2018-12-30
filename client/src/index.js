import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from 'drizzle-react';

import Election from './contracts/Election.json'

import App from './App';
import * as serviceWorker from './serviceWorker';

const options = {
    contracts: [
        Election,
    ]
}

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
    <DrizzleContext.Provider drizzle={drizzle}>
        <App />
    </DrizzleContext.Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();