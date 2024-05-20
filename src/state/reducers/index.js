import { combineReducers } from 'redux'

import layout from './layout'
import home from './home'

export const reducer = combineReducers({ layout: layout, home: home })