// Generated by LiveScript 1.3.1
(function() {
  var React, api, autocomplete, Dom, div, Autocomplete, Option, AssignmentType, SchoolTerms, GradeLevel, ProfileTypes;
  React = require("react");
  api = require("../api/api");
  autocomplete = require("./autocomplete");
  Dom = React.DOM;
  div = Dom.div;
  (Autocomplete = autocomplete.Autocomplete), (Option = autocomplete.Option);
  AssignmentType = React.createClass({
    getInitialState() {
      return {
        types: null
      };
    },
    UNSAFE_componentWillMount() {
      var this$ = this;
      return api.group.find().then(function(it) {
        return this$.setState({
          types: it
        });
      });
    },
    renderOptions() {
      if (this.state.types) {
        return this.state.types.map(function(item, rId) {
          return Option({
            key: rId,
            value: item.id,
            label: item.name + ""
          });
        });
      } else {
        return div(null, "Loading...");
      }
    },
    render() {
      return this.transferPropsTo(
        Autocomplete(
          {
            placeholder: "Type",
            dropdown: true
          },
          this.renderOptions()
        )
      );
    }
  });
  SchoolTerms = React.createClass({
    displayName: "SchoolTerms",
    getInitialState() {
      return {
        terms: null
      };
    },
    UNSAFE_componentWillMount() {
      var this$ = this;
      return api.term.find().then(function(it) {
        return this$.setState({
          terms: it
        });
      });
    },
    handleChange: function(it) {
      return this.props.onChange({
        target: {
          value: [it.target.value]
        }
      });
    },
    renderOptions() {
      if (this.state.terms) {
        return this.state.terms.map(function(item, rId) {
          return Option({
            key: rId,
            value: item.id,
            label: item.name + " - " + item.school_year
          });
        });
      } else {
        return div(null, "Loading...");
      }
    },
    render() {
      return div(
        null,
        Autocomplete(
          {
            onChange: this.handleChange,
            placeholder: "Term",
            dropdown: true
          },
          this.renderOptions()
        )
      );
    }
  });
  GradeLevel = React.createClass({
    displayName: "GradeLevel",
    getInitialState() {
      return {
        grades: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]
      };
    },
    renderOptions() {
      return this.state.grades.map(function(item, rId) {
        return Option({
          key: rId,
          value: item,
          label: item + ""
        });
      });
    },
    handleChange: function(it) {
      return this.props.onChange({
        target: {
          value: it.target.value
        }
      });
    },
    render() {
      return this.transferPropsTo(
        Autocomplete(
          {
            onChange: this.handleChange,
            placeholder: "Grade Level",
            dropdown: true
          },
          this.renderOptions()
        )
      );
    }
  });
  ProfileTypes = React.createClass({
    displayName: "ProfileTypes",
    getInitialState() {
      return {
        types: ["Student", "Teacher", "Parent", "Other", "Admin"]
      };
    },
    handleChange: function(it) {
      return this.props.onChange({
        target: {
          value: [it.target.value]
        }
      });
    },
    renderOptions() {
      return this.state.types.map(function(item, rId) {
        return Option({
          key: rId,
          value: item,
          label: item + ""
        });
      });
    },
    render() {
      return this.transferPropsTo(
        Autocomplete(
          {
            onChange: this.handleChange,
            placeholder: "Type",
            dropdown: true
          },
          this.renderOptions()
        )
      );
    }
  });
  module.exports = {
    AssignmentType: AssignmentType,
    GradeLevel: GradeLevel,
    ProfileTypes: ProfileTypes,
    SchoolTerms: SchoolTerms
  };
}.call(this));
