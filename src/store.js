import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk from "redux-thunk";
import pickBy from 'lodash';
import {uuidv4} from 'uuid';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
    socket: null,
    messages: [],
    tasks: {}
};

export const store = createStore(
    store_reducer,
    composeEnhancers(applyMiddleware(thunk))
);

function store_reducer(state = initialState, action) {
    switch (action.type) {
        case'push':
            return {...state, [action.name]: [...state[action.name], action.data]};

        case'shift':
            return {...state, [action.name]: state[action.name].slice(1) };

        case'update-one-data':
            return {
                ...state,
                [action.name]: {...state[action.name], [action.id]: {...state[action.name][action.id], ...action.data}}
            };

        case'set-one-data':
            return {...state, [action.name]: {...state, [state[action.id]]: action.data}};

        case'unset-one-data':
            return {...state, [action.name]: pickBy(state[action.name], v => v.id !== action.id)};

        case'set-all-data':
            return {...state, [action.name]: action.data};

        default:
            return state;
    }
}

class RedisWS {
    constructor(store, url) {
        this.socket = new WebSocket(url);
        this.opened = false;
        this.delayed = [];
        this.socket.onmessage = (event) => {
            store.dispatch(event.data);
        };
        this.socket.onopen = (event) => {
            var msg;
            this.opened = true;
            for (msg of this.delayed) {
                this.socket.send(msg);
            }
            this.delayed = [];
        };
        this.socket.onclose = (event) => {
            this.opened = false;
        };
        this.socket.onerror = (event) => {
            store.dispatch({
                type: 'push',
                name: 'messages',
                data: {message: event.message, variant: 'error'}
            });
        }
    }

    psubscribe(channel) {
        return this._send({type: 'psubscribe', channel, data});
    }

    publish(channel, data) {
        return this._send({type: 'publish', channel, data});
    }

    set(key, data) {
        return this._send({type: 'set', key, data});
    }

    get(key, data) {
        return this._send({type: 'get', key, data});
    }

    lpush(queue, data) {
        return this._send({type: 'lpush', queue, data});
    }

    lpop(queue, data) {
        return this._send({type: 'lpush', queue, data});
    }

    _send(data) {
        data.id = uuidv4();
        if (this.opened) {
            this.socket.send(data);
        } else {
            this.delayed.append(data);
        }
        return data.id;
    }
}

class Celery {
    constructor(redis, queue) {
        this.redis = redis;
        this.queue = queue;
    }

    call(task, args = [], kwargs = {}) {
        this.redis.lpush(this.queue, {task, args, kwargs});
    }
}

class CRUD {
    constructor(type, base) {
        this.type = type;
        this.base = base;
    }

    get(id) {
        return (dispatch) => {
            fetch(`${this.base}/${this.type}/${id}`, {
                method: 'GET',
            }).then(resp => dispatch({
                type: 'set-one-data',
                name: this.type,
                id,
                data: resp.json()
            })).catch(err => dispatch(_message(err)));
        }
    }

    getAll() {
        return (dispatch) => {
            fetch(`${this.base}/${this.type}`, {
                method: 'GET',
            }).then(resp => dispatch({
                type: 'set-all-data',
                name: this.type,
                data: resp.json()
            })).catch(err => dispatch(_message(err)));
        }
    }

    add(data) {
        return (dispatch) => {
            fetch(`${this.base}/${this.type}`, {
                method: 'POST', body: JSON.stringify(data)
            }).then(resp => dispatch({
                type: 'set-one-data',
                name: this.type,
                id: resp.json(),
                data
            })).catch(err => dispatch(_message(err)));
        }
    }

    update(id, data) {
        return (dispatch) => {
            fetch(`${this.base}/${this.type}/${id}`, {
                method: 'PUT', body: JSON.stringify(data)
            }).then(resp => dispatch({
                type: 'update-one-data',
                name: this.type,
                id,
                data
            })).catch(err => dispatch(_message(err)));
        }
    }

    delete(id) {
        return (dispatch) => {
            fetch(`${this.base}/${this.type}/${id}`, {
                method: 'DELETE'
            }).then(resp => dispatch({
                type: 'unset-one-data',
                name: this.type,
                id
            })).catch(err => dispatch(_message(err)));
        }
    }

    _message(err) {
        return {type: 'push', name: 'messages', data: {message: err, variant: 'error'}};
    }
}
