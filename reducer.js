import {
  FILTERED_DATA,
  SET_EDIT_DATA,
  CLEAR_DATA
} from '../actions/types.js'

const INITIAL_STATE = {
  filteredTags: [],
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case FILTERED_DATA:
      const addedTagsIds = action.payload.existingTags.map(tag => tag._id)
      const filteredSuggestions = action.payload.resultItems.filter(suggestion => !addedTagsIds.includes(suggestion._id))
      return { ...state, filteredTags: filteredSuggestions }
    case SET_EDIT_DATA:
      return { ...state, [action.payload.name]: { ...state[action.payload.name], ...action.payload.tagData } };
    case CLEAR_DATA:
      return INITIAL_STATE
    default:
      return state
  }
}
