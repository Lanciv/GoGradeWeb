// Generated by LiveScript 1.3.1
(function(){
  var React, cloneWithProps, api, ref$, filter, sortBy, escapeRegExp, Dom, div, h1, img, span, ul, a, i, button, input, p, strong, Option, Autocomplete;
  var PropTypes = require('prop-types');
  React = require('react');
  cloneWithProps = require('react/lib/cloneWithProps');
  api = require('../api/api');
  ref$ = require('prelude-ls'), filter = ref$.filter, sortBy = ref$.sortBy;
  escapeRegExp = function(str){
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };
  Dom = React.DOM;
  div = Dom.div, h1 = Dom.h1, img = Dom.img, span = Dom.span, ul = Dom.ul, a = Dom.a, i = Dom.i, button = Dom.button, input = Dom.input, p = Dom.p, strong = Dom.strong;
  Option = React.createClass({
    displayName: "AutocompleteOption",
    propTypes: {
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    },
    getDefaultProps(){
      return {
        role: 'option',
        tabIndex: '-1',
        isSelected: false
      };
    },
    render(){
      return this.transferPropsTo(div({
        className: "result"
      }, div({
        className: "info"
      }, div({
        className: "title"
      }, this.props.children || this.props.label))));
    }
  });
  Autocomplete = React.createClass({
    displayName: "Autocomplete",
    propTypes: {
      dropdown: PropTypes.bool,
      typeahead: PropTypes.bool,
      onInput: PropTypes.func,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.any
    },
    getDefaultProps(){
      return {
        typeahead: true,
        dropdown: false,
        onInput(){
          return {};
        },
        onChange(){
          return {};
        }
      };
    },
    getInitialState(){
      return {
        lastFocusedOption: null,
        focusedOption: null,
        value: this.props.value,
        isOpen: false,
        term: null
      };
    },
    handleKeyUp: function(e){
      var value;
      e.preventDefault();
      this.showList();
      value = e.target.value;
      if (e.keyCode === 27) {
        return this.refs.input.getDOMNode().blur();
      } else if (value.length === 0) {
        return this.setState({
          term: value
        });
      } else {
        return this.setState({
          term: value
        });
      }
    },
    handleOptionOnSelect: function(it){
      this.refs.input.getDOMNode().value = it.props.label;
      this.setState({
        value: it.props.value,
        term: it.props.label
      });
      this.props.onChange({
        target: {
          value: it.props.value
        }
      });
      return this.hideList();
    },
    handleOptionMouseLeave: function(arg$){
      var index;
      index = arg$.index;
      return this.setState({
        lastFocusedOption: index
      });
    },
    handleOptionMouseEnter: function(arg$){
      var index;
      index = arg$.index;
      return this.setState({
        focusedOption: index
      });
    },
    renderOptions(){
      var includes, this$ = this;
      includes = function(str, needle){
        if (needle === null) {
          return true;
        }
        if (str == null) {
          return false;
        }
        return String(str.toLowerCase()).indexOf(needle.toLowerCase()) !== -1;
      };
      if (this.props.children) {
        return React.Children.map(this.props.children, function(child, index){
          var props;
          if (child.type !== Option.type) {
            return;
          }
          props = child.props;
          if (!includes(props.label, this$.state.term)) {
            return;
          }
          props.onClick = this$.handleOptionOnSelect.bind(this$, child);
          props.onMouseEnter = this$.handleOptionMouseEnter.bind(this$, {
            index: index
          });
          props.onMouseLeave = this$.handleOptionMouseLeave.bind(this$, {
            index: index
          });
          return child;
        });
      } else {
        return div({
          className: "result"
        }, div({
          className: "info"
        }, div({
          className: "title"
        }), "No Results..."));
      }
    },
    showList(){
      return this.setState({
        isOpen: true
      });
    },
    hideList(){
      return this.setState({
        isOpen: false
      });
    },
    handleInputFocus: function(e){
      e.preventDefault();
      if (this.props.dropdown) {
        return this.showList();
      }
    },
    handleInputBlur: function(it){
      it.preventDefault();
      if (this.state.focusedOption !== this.state.lastFocusedOption) {} else {
        return this.hideList();
      }
    },
    makeListStyle(){
      if (this.state.isOpen) {
        return {
          display: 'block'
        };
      } else {
        return {
          display: 'none'
        };
      }
    },
    toggleList(){
      if (this.state.isOpen) {
        return this.hideList();
      } else {
        return this.showList();
      }
    },
    renderInput(){
      return input({
        ref: "input",
        role: "typeahead",
        className: "prompt",
        type: "text",
        placeholder: this.props.placeholder,
        onKeyUp: this.handleKeyUp,
        onFocus: this.handleInputFocus,
        onBlur: this.handleInputBlur,
        autoComplete: "off"
      });
    },
    render(){
      console.warn('WARN: FormInputRow has been deprecated.');
      return div({
        className: "ui search"
      }, this.props.dropdown
        ? div({
          className: "ui icon input"
        }, this.renderInput(), i({
          className: "sort ascending icon",
          onClick: this.toggleList
        }))
        : this.renderInput(), div({
        ref: "list",
        className: "results",
        style: this.makeListStyle()
      }, this.renderOptions()));
    }
  });
  module.exports = {
    Autocomplete: Autocomplete,
    Option: Option
  };
}).call(this);
