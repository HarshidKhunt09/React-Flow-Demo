import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import Error404 from '../Error404';
import { ROUTES } from '../common/constant';
import DashboardWrapper from '../dashboard';
import history from '../historyData';

const ContentRoutes = () => (
  <Router history={history}>
    <Switch>
      <Route path={ROUTES?.MAIN} component={DashboardWrapper} />
      <Route path='*' component={Error404} />
    </Switch>
  </Router>
);

export default ContentRoutes;
