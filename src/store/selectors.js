import {createSelector} from 'reselect'
import moment from 'moment'
import _ from 'lodash'

export const getFormattedRestaurants = createSelector(
  state => state.value.dayOffset,
  state => state.data.restaurants || [],
  state => state.data.menus,
  (dayOffset, restaurants, menus) => {
    const day = moment().add(dayOffset, 'day').format('YYYY-MM-DD')
    return _.orderBy(
        restaurants.map(restaurant => {
           const courses = _.get(menus, [restaurant.id, day], [])
           return {...restaurant, courses, noCourses: !courses.length}
        }),
     ['noCourses'])
  }
)

export const isAreaHidden = createSelector(
  state => state.preferences.hiddenAreas, (state, props) => props.area,
  (hiddenAreas, area) => hiddenAreas.some(id => id === area.id)
)

export const selectLang = state => state.preferences.lang
