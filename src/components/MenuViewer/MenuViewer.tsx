import * as React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import * as classnames from 'classnames';
import { MdContentCopy, MdLink, MdShare } from 'react-icons/md';

import { uiState, preferenceStore } from '../../store';
import CourseList from '../CourseList';
import DaySelector from '../DaySelector';
import { getCourses } from '../../utils/api';
import { CourseType } from '../../store/types';
import * as css from './MenuViewer.scss';
import Tooltip from '../Tooltip';

type Props = {
  restaurantId: number;
  showCopyButton?: boolean;
  maxHeight?: number;
};

@observer
export default class MenuViewer extends React.Component {
  removeAutorun: Function;
  props: Props;
  state: {
    courses: Array<CourseType>;
    loading: boolean;
    error: Error | null;
  } = {
    courses: [],
    loading: false,
    error: null
  };

  onCopy = (target: string) => {
    const textArea = document.createElement('textarea');
    if (target === 'courses') {
      textArea.value = this.state.courses
        .map(c => `${c.title} (${c.properties.join(', ')})`)
        .join('\n');
    } else if (target === 'url') {
      textArea.value = location.href;
    }
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  };

  share = () => {
    (navigator as any).share({
      title: 'Kanttiinit.fi',
      url: location.href
    });
  };

  componentDidMount() {
    this.removeAutorun = autorun(async () => {
      try {
        this.setState({ loading: true });
        const courses = await getCourses(
          this.props.restaurantId,
          uiState.selectedDay,
          preferenceStore.lang
        );
        this.setState({ courses, loading: false, error: null });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeAutorun();
  }

  render() {
    const { courses, loading } = this.state;
    const { showCopyButton } = this.props;
    return (
      <div>
        <div className={css.header}>
          <DaySelector root={location.pathname} />
          {showCopyButton && (
            <div className={css.copyButtons}>
              {'share' in navigator && (
                <Tooltip translationKey="shareURL">
                  <MdShare size={18} onClick={this.share} />
                </Tooltip>
              )}
              <Tooltip translationKey="copyURLToClipboard">
                <MdLink size={18} onClick={() => this.onCopy('url')} />
              </Tooltip>
              <Tooltip translationKey="copyMenuToClipboard">
                <MdContentCopy
                  size={18}
                  onClick={() => this.onCopy('courses')}
                />
              </Tooltip>
            </div>
          )}
        </div>
        <CourseList
          className={classnames(css.courseList, loading && css.coursesLoading)}
          courses={courses}
        />
      </div>
    );
  }
}
