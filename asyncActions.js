const redux = require('redux')
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware
const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')

//state
const initialState = {
    loading : false,
    users: [],
    error: ''
    
}

//action/ functions that return an action
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE'

//action-creator
const fetchUsersRequest = () => {
    return{
        type: FETCH_USERS_REQUEST
}
}

const fetchUsersSuccess = users =>{
    return{
        type: FETCH_USERS_SUCCESS,
        payload: users
    }
}

const fetchUsersFailure = error => { // argument is error in arrow function and users as above
    return{
        type: FETCH_USERS_FAILURE,
        payload: Error
    }
}
// now define reducer function

const reducer = (state= initialState , action) => {
        switch(action.type)
        {
            case FETCH_USERS_REQUEST: // if request success payload users if failed then error message
            return{
                ...state,
                loading: true
            }
            case FETCH_USERS_SUCCESS:
                return{
                    loading: false,
                    users : action.payload,
                    error : ''
                }
            case FETCH_USERS_FAILURE:
                return{
                    loading:false,
                    users:[],
                    error: action.payload
                    
                }
        }
}
// final step to define async action creator
const fetchUsers = () => {
    return function(dispatch){
        dispatch(fetchUsersRequest())
           axios.get('http://jsonplaceholder.typicode.com/users')//if request is success the response
           .then(response => {
                 //response.data is the array of users
                 const users = response.data.map(user => user.id)
                 dispatch(fetchUsersSuccess(users))
           })
           .catch(error => {
               //error.message give description of error
               dispatch(fetchUsersFailure(error.message))
           })
    }
}
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
store.subscribe(() => {console.log(store.getState())})
store.dispatch(fetchUsers)
