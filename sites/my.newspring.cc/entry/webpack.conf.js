var webpack = require("webpack");
var path = require("path");

module.exports = {
  externals: {
    // Make sure we use Meteor package libs and react
    "react": "React",
    "react-helmet": "ReactHelmet",
    "react-router": "ReactRouter",
    "react-dom": "ReactDOM",
    "react-addons-transition-group": "React.addons.TransitionGroup",
    "react-addons-css-transition-group": "React.addons.CSSTransitionGroup",
    "react-addons-create-fragment": "React.addons.createFragment",
    "react-addons-pure-render-mixin": "React.addons.PureRenderMixin",
    "react-addons-update": "React.addons.update",
    "react-addons-linked-state-mixin": "React.addons.LinkedStateMixin"
  },
  devServer: {
    // You can change this to your server IP address to access it remotely
    host: "localhost"
  },
  hotMiddleware: {
    reload: true
  },
  resolve: {
    root: path.join(__dirname, "..", "modules"),
    alias: {
      apollos: path.join(__dirname, "..", "..", "..", "apollos")
    },
    extensions: ["", ".js", ".jsx", ".json", ".css"]
  }
};