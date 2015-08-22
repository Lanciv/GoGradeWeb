
import React from 'react';
import {Route, Redirect, NotFoundRoute} from 'react-router';
import App from './app';
import SignedIn from './components/SignedIn';
import LoginModule from './modules/LoginModule';
import LogoutModule from './modules/Logout';
import DashboardModule from './modules/DashboardModule';
import NotFoundModule from './modules/NotFoundModule';
import Classes from './modules/classes/index';
import Setup from './modules/setup/Container';
import People from './modules/people/index';
import UserList from './modules/UserList';

export default (
  <Route handler={App}>
    <Route name="login" handler={LoginModule} />
    <Route handler={SignedIn}>
      <Route name="logout" handler={LogoutModule} />
      <Route name="people" handler={People.List} />
      <Route name="users" handler={UserList} />
      <Route name="people.detail" path="people/:resourceID" handler={People.Detail} />
      <Route name="course" handler={Classes.List} />
      <Route path="course/:term_id/:resourceID" handler={Classes.View}>
        <Route name="course.overview" title="Overview" path="overview" handler={Classes.Overview} />
        <Route name="course.grades" title="Grades" path="grades" handler={Classes.Grades} />
        <Route name="course.students" title="Students" path="students" handler={Classes.Students} />
        <Route name="course.assignments" title="Assignments" path="assignments" handler={Classes.Assignments} />
        <Route name="course.settings" title="Settings" path="settings" handler={Classes.Settings} />
      </Route>
      <Route name="setup" handler={Setup.Container}>
        <Route name="setup.terms" path="terms" handler={Setup.Terms} />
      </Route>
      <Route name="dashboard" path="dashboard" title="Dashboard" handler={DashboardModule} />
      <Redirect path="/" to="dashboard" />
    </Route>
    <NotFoundRoute handler={NotFoundModule} />
  </Route>
);
