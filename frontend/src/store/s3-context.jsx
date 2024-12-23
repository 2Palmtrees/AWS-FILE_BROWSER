/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from 'react';
import { deleteObject, getObjects, uploadObject } from '../http';

export const S3Context = createContext({
  fetchStatus: '',
  folders: [],
  files: [],
  prefix: '',
  error: '',
  inputErrors: {},
  addItem: () => {},
  editItem: () => {},
  deleteItem: () => {},
  fetchObjects: () => {},
  resetError: () => {},
});

function reducer(state, action) {
  switch (action.type) {
    case 'FETCHING':
      return { ...state, fetchStatus: 'fetching' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        fetchStatus: 'idle',
        folders: action.payload.folders,
        files: action.payload.files,
        prefix: action.payload.prefix,
      };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload.error, fetchStatus: 'error' };

    case 'ADD':
      return { ...state, fetchStatus: 'uploading' };
    case 'ADD_SUCCESS': {
      const updatedItems = [...state[action.payload.itemType]];
      updatedItems.push(action.payload.newItem);
      return {
        ...state,
        fetchStatus: 'idle',
        [action.payload.itemType]: updatedItems,
      };
    }
    case 'ADD_ERROR':
      return { ...state, error: action.payload.error, fetchStatus: 'error' };
    case 'INPUT_ERRORS':
      return {
        ...state,
        inputErrors: action.payload,
        fetchStatus: 'error',
      };

    case 'DELETE': {
      const updatedItems = state[action.payload.itemType].filter(
        (o) => o.key !== action.payload.key
      );
      return {
        ...state,
        fetchStatus: 'deleting',
        [action.payload.itemType]: updatedItems,
      };
    }
    case 'DELETE_SUCCESS': {
      return { ...state, fetchStatus: 'idle' };
    }
    case 'DELETE_ERROR': {
      return {
        ...state,
        error: action.payload.error,
        fetchStatus: 'error',
        [action.payload.itemType]: action.payload.previousItems,
      };
    }
    case 'RESET_ERROR':
      return { ...state, error: '', inputErrors: '', fetchStatus: 'idle' };

    default:
      return state;
  }
}
const initialState = {
  fetchStatus: 'idle',
  folders: [],
  files: [],
  prefix: '',
  error: '',
};

export default function S3ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    handleFetchObjects({});
  }, []);

  async function handleFetchObjects({ delimiter, prefix }) {
    dispatch({ type: 'FETCHING' });
    try {
      const { data } = await getObjects({ delimiter, prefix });

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          folders: data.folderObjects,
          files: data.fileObjects,
          prefix: data.prefix,
        },
      });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: { error } });
    }
  }

  async function handleAddItem(fd, itemType) {    
    try {
      dispatch({ type: 'ADD' });
      const data = await uploadObject(fd);
      console.log('HALLO?',data);
      

      if (data.errors) {
        console.log(data.errors);
        dispatch({ type: 'INPUT_ERRORS', payload: data });
        const error = new Error('input error!');
        throw error;
      } else {
        const newItem = await data.newObject;

        dispatch({ type: 'ADD_SUCCESS', payload: { newItem, itemType } });
      }
    } catch (error) {
      dispatch({ type: 'ADD_ERROR', payload: { error } });
      throw error;
    }
  }

  async function handleEditItem(item, fd, itemType) {
    try {
      await handleAddItem(fd, itemType);
      await handleDeleteItem(item.key, itemType);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteItem(key, itemType) {
    const previousItems = [...state[itemType]];
    dispatch({
      type: 'DELETE',
      payload: { key, itemType },
    });
    try {
      const response = await deleteObject(key);
      console.log(response);
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'DELETE_ERROR',
        payload: { itemType, error, previousItems },
      });
      console.log(error.message);
      throw error;
    }
  }

  function handleResetError() {
    dispatch({ type: 'RESET_ERROR' });
  }

  const ctxValue = {
    fetchStatus: state.fetchStatus,
    folders: state.folders,
    files: state.files,
    prefix: state.prefix,
    error: state.error,
    inputErrors: state.inputErrors,
    addItem: handleAddItem,
    editItem: handleEditItem,
    deleteItem: handleDeleteItem,
    fetchObjects: handleFetchObjects,
    resetError: handleResetError,
  };

  return <S3Context.Provider value={ctxValue}>{children}</S3Context.Provider>;
}
