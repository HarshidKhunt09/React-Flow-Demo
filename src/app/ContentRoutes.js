import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Error404 from '../Error404';
import { ROUTES } from '../common/constant';
import history from '../historyData';
import WorkflowWrapper from '../workflow';

const ContentRoutes = () => (
  <Router history={history}>
    <Switch>
      <Route path={ROUTES?.MAIN} component={WorkflowWrapper} />
      <Route path="*" component={Error404} />
    </Switch>
  </Router>
);

export default ContentRoutes;
