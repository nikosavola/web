import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {
  MdDirectionsWalk,
  MdDirectionsBike,
  MdStar,
  MdMoreVert,
  MdFlag,
  MdPlace
} from 'react-icons/md';

import * as c from 'classnames';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

import Colon from '../Colon';
import CourseList from '../CourseList';
import { preferenceStore, uiState } from '../../store';
import Text from '../Text';
import * as css from './Restaurant.scss';
import { RestaurantType } from '../../store/types';

const Distance = ({ distance }: { distance: number }) => {
  const kilometers = distance > 1500;
  return (
    <div className={css.meta + ' ' + css.location}>
      {!distance ? (
        <MdPlace className="inline-icon" />
      ) : kilometers ? (
        <MdDirectionsBike className="inline-icon" />
      ) : (
        <MdDirectionsWalk className="inline-icon" />
      )}
      {!distance ? (
        <Text id="locating" />
      ) : kilometers ? (
        parseFloat(String(distance / 1000)).toFixed(1)
      ) : (
        Math.round(distance)
      )}
      &nbsp;
      {distance && <Text id={kilometers ? 'kilometers' : 'meters'} />}
    </div>
  );
};

type Props = RouteComponentProps<any> & {
  restaurant: RestaurantType;
};

export default withRouter(
  observer(
    class Restaurant extends React.Component<Props, {}> {
      toggleStar = () => {
        const { restaurant } = this.props;
        preferenceStore.setRestaurantStarred(
          restaurant.id,
          !restaurant.isStarred
        );
      };

      render() {
        const { restaurant } = this.props;
        const dayOfWeek = uiState.selectedDay.isoWeekday() - 1;
        const isClosed =
          uiState.selectedDay.isSame(moment(), 'day') && !restaurant.isOpenNow;
        const { search } = this.props.location;
        return (
          <div
            className={c(css.container, {
              [css.empty]: restaurant.noCourses,
              [css.shut]: isClosed
            })}
          >
            <div className={css.header}>
              <h2>
                {restaurant.name}
                {preferenceStore.useLocation && (
                  <Distance distance={restaurant.distance} />
                )}
              </h2>
              <div className={css.meta} style={{ textAlign: 'right' }}>
                {restaurant.openingHours[dayOfWeek] && [
                  <Colon key="colon">
                    {restaurant.openingHours[dayOfWeek].replace('-', '–')}
                  </Colon>,
                  <br key="lineBreak" />
                ]}
                {isClosed && (
                  <Text
                    id="restaurantClosed"
                    className={css.closedText}
                    element="small"
                  />
                )}
              </div>
            </div>
            <CourseList className={css.body} courses={restaurant.courses} />
            <div className={css.restaurantActions}>
              <Link
                className={css.actionIcon}
                to={{ pathname: `/report/${restaurant.id}`, search }}
              >
                <MdFlag size={18} />
              </Link>
              <div style={{ marginLeft: 'auto' }}>
                <a
                  onClick={this.toggleStar}
                  style={{
                    color: restaurant.isStarred ? '#FFA726' : undefined
                  }}
                  className={css.actionIcon}
                >
                  <MdStar size={18} />
                </a>
                &nbsp;
                <Link
                  className={css.actionIcon}
                  to={{ pathname: `/restaurant/${restaurant.id}`, search }}
                >
                  <MdMoreVert size={18} />
                </Link>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
