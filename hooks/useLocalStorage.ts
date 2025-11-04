import { useReducer, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialState: T, reducer?: React.Reducer<T, any>): [T, React.Dispatch<any>] {
    const initializer = (initial: T) => {
        try {
            const storedState = localStorage.getItem(key);
            return storedState ? JSON.parse(storedState) : initial;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return initial;
        }
    };
    
    const genericReducer = (state: T, action: { payload: T }) => action.payload;

    const [state, dispatch] = useReducer(reducer || genericReducer, initialState, initializer);

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [state, key]);

    return [state, dispatch];
}

export default useLocalStorage;
