// Generated by LiveScript 1.3.1
(function(){
  var React, NewTable, api, Header, Modal, Dom, div, input, i, Grid, find, GradeInput, AssignmentGrades;
  React = require('react');
  NewTable = require('../../components/NewTable');
  api = require('../../api/api');
  Header = require('../../components/PageHeader');
  Modal = require('../../components/SemanticModal');
  Dom = React.DOM;
  div = Dom.div, input = Dom.input, i = Dom.i;
  Grid = NewTable.Grid;
  find = require('prelude-ls').find;
  GradeInput = React.createClass({
    getInitialState(){
      var ref$;
      return {
        initialValue: this.props.value,
        value: this.props.value,
        gradeId: (ref$ = this.props.row.grade) != null ? ref$.id : void 8,
        maxScore: this.props.column.maxScore,
        loading: false,
        error: false
      };
    },
    onChange: function(it){
      return this.setState({
        value: it.target.value
      });
    },
    changeLoading: function(loading, error){
      return setTimeout(this.setState.bind(this, {
        loading: loading,
        error: error || false
      }), 300);
    },
    saveChange: function(e){
      var data, this$ = this;
      e.preventDefault();
      if (!deepEq$(this.state.initialValue, this.state.value, '===')) {
        data = {
          personId: this.props.row.personId,
          assignmentId: this.props.column.assignmentId,
          grade: Number(this.state.value)
        };
        this.setState({
          loading: true
        });
        if (!this.state.gradeId) {
          return api.grade.create(data).then(function(){
            return this$.changeLoading(false);
          })['catch'](function(){
            return this$.changeLoading(false, true);
          });
        } else {
          return api.grade.update(this.state.gradeId, data).then(function(){
            return this$.changeLoading(false);
          })['catch'](function(){
            return this$.changeLoading(false, true);
          });
        }
      }
    },
    render(){
      var renderIcon, this$ = this;
      renderIcon = function(){
        if (this$.state.loading) {
          return i({
            className: "spinner loading icon"
          });
        } else if (this$.state.error) {
          return i({
            className: "red circular inverted attention sign icon"
          });
        } else {
          return i({
            className: "icon"
          }, " / " + this$.state.maxScore);
        }
      };
      return div({
        className: "ui icon input " + (this.state.error ? 'error' : void 8)
      }, input({
        type: "text",
        className: "grade",
        placeholder: "Score",
        onBlur: this.saveChange,
        value: this.state.value,
        onChange: this.onChange
      }), renderIcon());
    }
  });
  AssignmentGrades = React.createClass({
    displayName: "AssignmentGrades",
    getInitialState(){
      return {
        students: [],
        grades: [],
        assignment: {}
      };
    },
    getGrades(){
      var this$ = this;
      return api.grade.find({
        assignmentId: this.props.assignmentId
      }).then(function(it){
        return this$.setState({
          grades: it
        });
      });
    },
    getStudents(){
      var this$ = this;
      return api.enrollment.find({
        classId: this.state.assignment.classId,
        termId: this.state.assignment.termId
      }).then(function(it){
        return this$.setState({
          students: it
        });
      });
    },
    getAssignment(){
      var this$ = this;
      return api.assignment.get(this.props.assignmentId).then(function(it){
        return this$.setState({
          assignment: it
        });
      }).then(function(){
        this$.getGrades();
        return this$.getStudents();
      });
    },
    buildCols(){
      var cols, ref$;
      cols = [
        {
          key: "fullName",
          display: "Student"
        }, {
          key: "grade.comment",
          display: "Comments"
        }, {
          key: "grade.grade",
          display: "Grade",
          assignmentId: this.props.assignmentId,
          maxScore: (ref$ = this.state.assignment) != null ? ref$.maxScore : void 8,
          renderer: GradeInput
        }
      ];
      return cols;
    },
    buildData(){
      var i$, ref$, len$, x, result, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.state.students).length; i$ < len$; ++i$) {
        x = ref$[i$];
        result = {
          personId: x.personId,
          fullName: x.person.firstName + " " + x.person.lastName,
          grade: find(fn$, this.state.grades)
        };
        results$.push(result);
      }
      return results$;
      function fn$(it){
        return it.personId === x.personId;
      }
    },
    componentWillMount(){
      api.grade.events.addListener("change", this.getGrades);
      return this.getAssignment();
    },
    componentWillUnmount(){
      return api.grade.events.removeListener("change", this.getGrades);
    },
    render(){
      var ref$, ref1$, ref2$;
      return this.transferPropsTo(Modal.SemanticModal({
        title: ((ref$ = this.state.assignment) != null ? ref$.name : void 8) + " - " + ((ref1$ = this.state.assignment) != null ? (ref2$ = ref1$.type) != null ? ref2$.name : void 8 : void 8)
      }, Grid({
        columns: this.buildCols(),
        data: this.buildData()
      })));
    }
  });
  module.exports = AssignmentGrades;
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) {
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);