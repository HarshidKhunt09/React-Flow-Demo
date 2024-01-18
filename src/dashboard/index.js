import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import { ROUTES } from '../common/constant';
import EditWorkflow from './components/EditWorkflow';
import Workflows from './components/Workflows';

const DashboardWrapper = () => (
  <Switch>
    <Route exact path={ROUTES?.MAIN} component={Dashboard} />
    <Route exact path={ROUTES?.WORKFLOWS} component={Workflows} />
    <Route exact path='/edit/:id' component={EditWorkflow} />
  </Switch>
);

export default DashboardWrapper;
