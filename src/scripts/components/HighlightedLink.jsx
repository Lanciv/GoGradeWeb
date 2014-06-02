var React = require('react');
var RRouter = require('rrouter');
var RoutingContextMixin = RRouter.RoutingContextMixin;
var Link = RRouter.Link;
var utils = require('../utils');
var urlPattern = require('url-pattern');

var HighlightedLink = React.createClass({
  mixins: [RoutingContextMixin],
  getDefaultProps: function() {
    return {
      activeClassName: 'active',
      matchPattern: '/' + this.props.to
    };
  },
  isActive: function() {
    if (this.props.matchPattern) {
      var pattern = urlPattern.newPattern(this.props.matchPattern);
      // console.log(!!pattern.match(this.getPath()));
      console.log(!!pattern.match(this.getMatch().path));
      return !!pattern.match(this.getMatch().path);
    } else { return false; }
  },
  render: function() {
    var className;
    if (this.props.activeClassName && this.isActive()) {
      className = this.props.activeClassName;
    }
    var link = Link(null, this.props.children);
    return (
      <li className={className}>
      {this.transferPropsTo(link)}
      </li>);
  }
});

module.exports = HighlightedLink;
