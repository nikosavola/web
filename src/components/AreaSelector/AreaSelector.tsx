import * as React from 'react';
import { observer } from 'mobx-react';
import * as sortBy from 'lodash/sortBy';
import { MdMap, MdStar } from 'react-icons/md';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { dataStore, preferenceStore } from '../../store';
import * as css from './AreaSelector.scss';
import Text from '../Text';
import PageContainer from '../PageContainer';
import { AreaType } from '../../store/types';

type SpecialArea = {
  id: -1 | -2;
  name: React.ReactNode;
  icon: React.ReactNode;
  iconColor: string;
};

const specialAreas: Array<SpecialArea> = [
  { id: -2, name: <Text id="nearby" />, icon: <MdMap />, iconColor: '#424242' },
  {
    id: -1,
    name: <Text id="starred" />,
    icon: <MdStar style={{ marginLeft: '0.4rem' }} />,
    iconColor: '#FFA726'
  }
];

const Area = ({
  area,
  selectArea
}: {
  area: AreaType | SpecialArea;
  selectArea: (id: number) => void;
}) => (
  <div
    className={
      css.area +
      (preferenceStore.selectedArea === area.id ? ' ' + css.selected : '')
    }
  >
    <button
      onClick={() => selectArea(area.id)}
      className={
        'button-text ' +
        (preferenceStore.selectedArea === area.id ? css.selected : '')
      }
    >
      {'icon' in area ? (
        <div className={css.icon} style={{ color: area.iconColor }}>
          {area.icon}
        </div>
      ) : (
        <img className={css.map} src={area.mapImageUrl} />
      )}
      <br />
      {area.name}
    </button>
  </div>
);

@observer
class AreaSelector extends React.Component<RouteComponentProps<any>> {
  selectArea = (areaId: number) => {
    preferenceStore.selectedArea = areaId;
    this.props.history.replace('/');
  };

  render() {
    return (
      <PageContainer title={<Text id="selectArea" />}>
        <div className={css.container}>
          {specialAreas.map(area => (
            <Area key={area.id} selectArea={this.selectArea} area={area} />
          ))}
          {sortBy(dataStore.areas.data, 'name').map((area: AreaType) => (
            <Area key={area.id} selectArea={this.selectArea} area={area} />
          ))}
        </div>
      </PageContainer>
    );
  }
}

export default withRouter(AreaSelector);
