import { createSelector } from 'reselect'
import { removedStatusFilter } from './constants'

export const getFilter = state => state.groupFilter
export const getSearch = state => state.search
export const getGroups = state => state.groupIndex

export const getFilteredGroups = createSelector(
  [getGroups, getFilter, getSearch],
  (groups, filter, search) => {
    return groups
      .map(group => {
        const filterStatusGroup = {
          ...group,
          operators: group.operators
            ? group.operators.filter(operator => {
                if (Number(filter) == 0 || (operator.statusId == filter && !removedStatusFilter.includes(operator.statusId))) {
                  return true
                } else {
                  return false
                }
              })
            : []
        }
        if (search) {
          const newGroup = {
            ...filterStatusGroup,
            operators:
              filterStatusGroup.operators &&
              filterStatusGroup.operators.filter(
                operator =>
                  operator.userName
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) >= 0
              )
          }
          if (
            newGroup.description.toLowerCase().indexOf(search.toLowerCase()) >= 0 
            && newGroup.operators 
            && newGroup.operators.length < 1
          ) {
            return filterStatusGroup
          } else {
            return newGroup
          }
        } else {
          return filterStatusGroup
        }
      })
      .filter(group => {
        const matchDescription =
          search &&
          group.description.toLowerCase().indexOf(search.toLowerCase()) >= 0

        if (search) {
          if (group.operators.length < 1) {
            if(matchDescription && Number(filter) === 0){
              return true
            }
            return false
          } else {
            return true
          }
        } else {
          if (Number(filter) === 0) {
            return true
          }
          if (group.operators.length < 1) {
            return false
          } else {
            return true
          }
        }
      })
  }
)
