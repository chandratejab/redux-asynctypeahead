import { SET_EDIT_TAGS } from './types';

export const setTags = (name, tagData) => {
  return {
    type: SET_EDIT_TAGS,
    payload: { name, tagData }
  }
}
export const clearDataByType = actionType => {
  return {
    type: actionType
  }
}
