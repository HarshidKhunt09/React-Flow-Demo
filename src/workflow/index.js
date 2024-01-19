import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../common/constant';
import AddWorkflow from './pages/AddWorkflow';
import EditWorkflow from './pages/EditWorkflow';
import Workflows from './pages/Workflows';

const WorkflowWrapper = () => (
  <Switch>
    <Route exact path={ROUTES?.MAIN} component={AddWorkflow} />
    <Route exact path={ROUTES?.WORKFLOWS} component={Workflows} />
    <Route exact path="/edit/:id" component={EditWorkflow} />
  </Switch>
);

export default WorkflowWrapper;
