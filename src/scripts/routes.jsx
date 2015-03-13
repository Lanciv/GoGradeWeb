var React = require('react');
var {Route, Redirect, NotFoundRoute} = require('react-router');
var App = require('./app.jsx');
var SignedIn = require('./components/SignedIn.jsx');
var LoginModule = require('./modules/LoginModule.ls');
var LogoutModule = require('./modules/Logout.jsx');
var DashboardModule = require('./modules/DashboardModule.jsx');
var NotFoundModule = require('./modules/NotFoundModule');
var Classes = require('./modules/classes/index.ls');
var Setup = require('./modules/setup/Container');
var People = require('./modules/people/index');
var School = require('./modules/SchoolSettings.ls');

module.exports = (
  <Route handler={App}>
    <Route name="login" handler={LoginModule} />
    <Route handler={SignedIn}>
      <Route name="logout" handler={LogoutModule} />
      <Route name="school.settings" path="school/settings" handler={School.Settings} />
      <Route name="people" handler={People.List} />
      <Route name="people.detail" path="people/:resourceId" handler={People.Detail} />
      <Route name="class" handler={Classes.List} />
      <Route path="class/:termId/:resourceId" handler={Classes.View}>
        <Route name="class.overview" title="Overview" path="overview" handler={Classes.Overview} />
        <Route name="class.grades" title="Grades" path="grades" handler={Classes.Grades} />
        <Route name="class.students" title="Students" path="students" handler={Classes.Students} />
        <Route name="class.assignments" title="Assignments" path="assignments" handler={Classes.Assignments} />
        <Route name="class.settings" title="Settings" path="settings" handler={Classes.Settings} />
      </Route>
      <Route name="setup" handler={Setup.Container}>
        <Route name="setup.assignment-types" path="assignment-types" handler={Setup.AssignmentTypes} />
        <Route name="setup.terms" path="terms" handler={Setup.Terms} />
      </Route>
      <Route name="dashboard" path="dashboard" title="Dashboard" handler={DashboardModule} />
      <Redirect path="/" to="dashboard" />
    </Route>
    <NotFoundRoute handler={NotFoundModule} />
  </Route>
);
