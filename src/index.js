import React from 'react';
import { render } from 'react-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import './index.min.css';
// import { compose, applyMiddleware } from 'redux'
// import Home from './components/Home';
// import { thunk } from 'redux-thunk'

import { reducer } from './state/reducers/index'
import AppRoutes from './routes';

const store = configureStore({
    reducer: reducer,
    // middleware: compose(applyMiddleware(thunk)),
})

render(
    //<React.StrictMode>
    <Provider store={store}>
        <AppRoutes />
    </Provider>
    //</React.StrictMode>
    ,
    document.getElementById('root')
)

serviceWorker.unregister()