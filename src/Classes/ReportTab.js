import Moment from 'moment';
import { BaseTab } from './BaseTab';
import React from 'react';

export default class ReportTab extends BaseTab {
  constructor(TabObject, OpenTabs) {
    super(TabObject, OpenTabs);
    this.StartDate =
      Moment().hours() < 20
        ? Moment('08:00:00', 'HH:mm:ss')
        : Moment('20:00:00', 'HH:mm:ss');
    this.EndDate =
      Moment().hours() < 20
        ? Moment('20:00:00', 'HH:mm:ss')
        : Moment('08:00:00', 'HH:mm:ss').add(1, 'day');
    this.LeftSidebar = [React.lazy(() => import('../Components/LeftMenu'))];
  }
}
