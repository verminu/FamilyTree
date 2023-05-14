import {createContext, useContext, useEffect, useReducer} from 'react';

const UserContext = createContext();
const UserDispatchContext = createContext();

export function UsersProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, { users: [], loading: true, error: false });

    useEffect( () => {
        async function fetchData() {
            try {
                const response = await fetch('/user');
                const users = await response.json();

                dispatch({
                    type: 'FETCH_USERS_SUCCESS',
                    payload: users
                });
            }
            catch {
                dispatch({
                    type: 'FETCH_USERS_ERROR'
                });
            }
        }

        fetchData();

    }, []);

    return (
        <UserContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}

export function useUsers() {
    return useContext(UserContext);
}

export function useUsersDispatch() {
    return useContext(UserDispatchContext);
}

// create a hook for concatenating the username
export function useUserFullName() {
    return (user) => {
        return user.first_name + (user.middle_name ? ' ' + user.middle_name : '') + ' ' + user.last_name;
    }
}

function userReducer(state, action) {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            return { ...state, loading: false, error: false, users: action.payload };
        case 'FETCH_USERS_ERROR':
            return { ...state, loading: false, error: true };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        case 'UPDATE_USER':
            return { ...state, users: state.users.map((user) => user.id === action.payload.id ? action.payload : user) };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter((user) => user.id !== action.payload.id) };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}