import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import calendarGenesisReducer from './slicesCalendario/sliceCalendario';


const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [],
};

const rootReducer = combineReducers({
    calendar: calendarGenesisReducer
})

export { rootPersistConfig, rootReducer };