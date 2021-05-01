import {
    BOOKMARKS_INITIALIZING,
    BOOKMARK_UPDATED,
    BOOKMARKS_INITIALIZED,
    BOOKMARK_DELETE,
    BOOKMARKS_FAVORITES_INITIALIZING,
    BOOKMARKS_FAVORITES_INITIALIZED,
    BOOKMARK_ADD_TO_FAVORITES,
    BOOKMARK_REMOVE_FROM_FAVORITES
} from "./bookmarks.types";

const INITIAL_STATE = {
    myList: {
        isLoading: false,
        data: []
    },
    favorites: {
        isLoading: false,
        data: []
    },
};

const reducer = (state = INITIAL_STATE, action: {type: string, payload: any}) => {
    switch (action.type) {
        case BOOKMARKS_INITIALIZING:
            return {
                ...state,
                myList: {
                    ...state.myList,
                    isLoading: true,
                },
            };
        case BOOKMARKS_INITIALIZED:
            return {
                ...state,
                myList: {
                    isLoading: false,
                    data: [...action.payload]
                },
            };
        case BOOKMARK_ADD_TO_FAVORITES:
            return {
                ...state,
                myList: {
                    ...state.myList,
                    data: state.myList.data.map((item: any) => item.id === action.payload.id ? action.payload : item)
                },
                favorites: {
                    ...state.favorites,
                    data: [
                        ...state.favorites.data,
                        action.payload
                    ],
                }
            };
        case BOOKMARK_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                myList: {
                    ...state.myList,
                    data: state.myList.data.map((item: any) => item.id === action.payload.id ? action.payload : item)
                },
                favorites: {
                    ...state.favorites,
                    data: state.favorites.data.filter((item: any) => item.id !== action.payload.id)
                }
            };

        case BOOKMARK_UPDATED:
            return {
                ...state,
                myList: {
                    data: state.myList.data.map((item: any) => item.id === action.payload.id ? action.payload : item)
                },
            };
        case BOOKMARK_DELETE:
            return {
                ...state,
                myList: {
                    ...state.myList,
                    data: state.myList.data.filter((item: any) => item.id !== action.payload)
                },
            };

        case BOOKMARKS_FAVORITES_INITIALIZING:
            return {
                ...state,
                favorites: {
                    ...state.favorites,
                    isLoading: true,
                },
            };
        case BOOKMARKS_FAVORITES_INITIALIZED:
            return {
                ...state,
                favorites: {
                    isLoading: false,
                    data: [...action.payload]
                },
            };
        default: return state;
    }
};

export default reducer;