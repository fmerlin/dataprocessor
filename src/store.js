import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import omit from 'lodash';
import uuid from 'uuid';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
    socket: null,
    messages: {},
    tasks: {},
    categories: {
        "0": {id: "0", name: "Home", description: "This is the root category of your project", categories: [], batches: [] , parents:[]}
    },
    batches: {},
    runs: {}
};

export const store = createStore(
    store_reducer,
    composeEnhancers(applyMiddleware(thunk))
);

function mapput(data, value) {
    if (arguments.length > 2) {
        const field = arguments[2];
        const fields = Array.from(arguments).slice(3);
        return {...data, [field]: mapput(data[field], value, ...fields)};
    } else {
        return value(data);
    }
}

function removeKey(col, key) {
    const res = {... col};
    delete res[key];
    return res;
}

function store_reducer(state = initialState, action) {
    switch (action.type) {
        case'compose':
            return action.actions.reduce((state, action) => store_reducer(state, action), state);

        case'push':
            return mapput(state, v => [...v, action.data], action.table, action.id, action.field);

        case'pop':
            return mapput(state, v => v.filter(e => e !== action.data), action.table, action.id, action.field);

        case'set':
            return mapput(state, v => action.data, action.table, action.id);

        case'delete':
            return mapput(state, v => removeKey(v, action.id), action.table);

        case'load':
            return mapput(state, v => action.data, action.table);

        default:
            return state;
    }
}

export function action_compose() {
    return {type: 'compose', actions: Array.from(arguments)}
}

export function action_push(table, id, field, data) {
    return {type: 'push', table, field, id, data}
}

export function action_pop(table, id, field, data) {
    return {type: 'pop', table, field, id, data}
}

export function action_set(table, id, data) {
    return {type: 'set', table, id, data}
}

export function action_delete(table, id) {
    return {type: 'delete', table, id}
}

export function action_add_ref(table1, id1, field1, table2, id2, data2) {
    return action_compose(action_push(table1,id1,field1,id2), action_set(table2,id2,data2))
}

export function action_del_ref(table1, id1, field1, table2, id2) {
    return action_compose(action_pop(table1,id1,field1,id2), action_delete(table2,id2))
}

export function action_not_implemented() {
    const id = uuid.v4();
    return action_set('messages', id, {id, message: 'Not Implemented', variant: 'warning'})
}

export function action_info(message) {
    const id = uuid.v4();
    return action_set('messages', id, {id, message: message, variant: 'info'})
}


/*
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
        return this._send({type: 'psubscribe', channel});
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
            })).catch(err => dispatch(this._message(err)));
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
            })).catch(err => dispatch(this._message(err)));
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
            })).catch(err => dispatch(this._message(err)));
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
            })).catch(err => dispatch(this._message(err)));
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
            })).catch(err => dispatch(this._message(err)));
        }
    }

    _message(err) {
        return {type: 'push', name: 'messages', data: {message: err, variant: 'error'}};
    }
}
*/