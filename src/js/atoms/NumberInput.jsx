import React from 'react';

var {div, i, label, input} = React.DOM;


var NumberInput = React.createClass({
  getDefaultProps(){
    return {
      label: "",
      type: "text",
      placeholder: ""
    };
  },
  handleChange: function(e){
    var val = e.target.value;
    val = parseFloat(val) || val;

    var event = {target: {value: val}};

    return this.props.onChange(event);
  },
  render(){
    console.warn('WARN: NumberInput has been deprecated.');
    var placeholder;
    placeholder = this.props.placeholder || this.props.label;
    return div({
      className: "field"
    }, this.props.label ? label(null, this.props.label) : void 8, this.transferPropsTo(input({
      ref: "input",
      placeholder: placeholder,
      type: this.props.type,
      onChange: this.handleChange,
      value: this.props.value,
      onBlur: this.props.onBlur
    })));
  }
});

module.exports = NumberInput;