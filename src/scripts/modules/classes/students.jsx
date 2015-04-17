// Generated by LiveScript 1.3.1
(function(){
  var React, Panel, NewTable, ActionRenderer, autocomplete, api, Dom, div, button, Grid, StringRenderer, Autocomplete, Option, StudentActions, cols, ClassStudents;
  React = require('react');
  Panel = require('../../components/Panel');
  NewTable = require('../../components/NewTable');
  ActionRenderer = require('../../components/ActionRenderer');
  autocomplete = require('../../components/autocomplete');
  api = require('../../api/api.ls');
  Dom = React.DOM;
  div = Dom.div, button = Dom.button;
  Grid = NewTable.Grid, StringRenderer = NewTable.StringRenderer;
  Autocomplete = autocomplete.Autocomplete, Option = autocomplete.Option;
  StudentActions = React.createClass({
    unEnroll: function(e){
      e.preventDefault();
      return api.enrollment.del(this.props.row.id);
    },
    render: function(){
      var lnk;
      lnk = this.props.column.linkTo;
      return button({
        className: "ui button tiny",
        onClick: this.unEnroll
      }, "Un-Enroll");
    }
  });
  cols = [
    {
      key: 'person.firstName',
      display: 'First Name'
    }, {
      key: 'person.middleName',
      display: 'Middle Name'
    }, {
      key: 'person.lastName',
      display: 'Last Name'
    }, {
      key: 'person.gradeLevel',
      display: 'Grade Level'
    }, {
      display: 'Actions',
      renderer: StudentActions,
      linkTo: 'class',
      className: 'col-md-3'
    }
  ];
  ClassStudents = React.createClass({
    displayName: "ClassStudents",
    getInitialState: function(){
      return {
        students: []
      };
    },
    getEnrollments: function(){
      var this$ = this;
      return api.enrollment.find({
        classId: this.props.classId,
        termId: this.props.termId
      }).then(function(it){
        return this$.setState({
          students: it
        });
      });
    },
    componentDidMount: function(){
      var this$ = this;
      api.enrollment.events.addListener("change", this.getEnrollments);
      this.getEnrollments();
      api.person.find().then(function(it){
        return this$.setState({
          people: it
        });
      });
    },
    componentWillUnmount: function(){
      return api.enrollment.events.removeListener("change", this.getEnrollments);
    },
    studentSelected: function(it){
      return this.setState({
        selectedStudent: it.target.value
      });
    },
    enrollStudent: function(){
      return api.enrollment.create({
        personId: this.state.selectedStudent,
        classId: this.props.classId,
        termId: this.props.termId
      });
    },
    render: function(){
      return (
        <div>
          <div className="ui top attached segment">
            <div className="ui search">
              <Autocomplete className="ui fluid action input"
                onChange={this.studentSelected}
                placeholder="Student...">
                {this.state.people ? this.state.people.map((p, key) => {
                  return Option({
                    key: key,
                    value: p.id,
                    label: p.firstName + " " + p.lastName
                  });
                }) : "Loading..."}
              </Autocomplete>
              <div className="ui primary button" onClick={this.enrollStudent}>
                Enroll
              </div>
            </div>
          </div>
          <Grid className="bottom attached" columns={cols} data={this.state.students}>
          </Grid>
        </div>
      );
      // return div(null, div({
      //   className: "ui top attached segment"
      // }, div({
      //   className: "ui search form"
      // }, div({
      //   className: "ui fluid action input"
      // }, Autocomplete({
      //   onChange: this.studentSelected,
      //   placeholder: "Student..."
      // }, this.state.people ? this.state.people.map(function(p, key){
      //   return Option({
      //     key: key,
      //     value: p.id,
      //     label: p.firstName + " " + p.lastName
      //   });
      // }) : "Loading..."), div({
      //   className: "ui primary button",
      //   onClick: this.enrollStudent
      // }, "Enroll")))), Grid({
      //   className: "bottom attached",
      //   columns: cols,
      //   data: this.state.students
      // }));
    }
  });
  module.exports = ClassStudents;
}).call(this);
