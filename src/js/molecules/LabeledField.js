

import React from 'react';
import cx from 'classnames';

import Formsy from 'formsy-react';

var LabeledInput = React.createClass({
    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],
    getDefaultProps(){
      return {
        onChange() {},
        field: 'input',
        required: true,
        type: 'text'
      };
    },
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue: function (event) {
      this.setValue(event.currentTarget.value);

      this.props.onChange(event);
    },
    render() {
      let {type, placeholder, label} = this.props;

      const error = this.showError() && this.getErrorMessage() !== undefined ? (
        <span className="help-block">
          {this.getErrorMessage()}
        </span>
      ) : null;

      const renderLabel = label ? (
          <label className="control-label">
            {label}
          </label>
        ) : null;

      const Field = this.props.field;


      return (
        <div className={cx(
          'form-group',
          this.props.size,
          {'has-error': this.showError()})}>
          {renderLabel}
          <Field
            className="form-control"
            type={type}
            onChange={this.changeValue}
            value={this.getValue()}
            placeholder={placeholder || label}
            />

          {this.isRequired() ?
            (
              <div className="ui corner label">
                <i className="red asterisk icon" />
              </div>
            ): null}
            {error}
        </div>
      );
    }
  });


module.exports = LabeledInput;