'use strict';

exports.__esModule = true;
exports.LinkedIn = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getPopupPositionProperties = function getPopupPositionProperties(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === undefined ? 600 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 600 : _ref$height;

  var left = screen.width / 2 - width / 2;
  var top = screen.height / 2 - height / 2;
  return 'left=' + left + ',top=' + top + ',width=' + width + ',height=' + height;
};

var generateRandomString = function generateRandomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

var LINKEDIN_OAUTH2_STATE = 'linkedin_oauth2_state';

var LinkedIn = exports.LinkedIn = function (_Component) {
  _inherits(LinkedIn, _Component);

  function LinkedIn() {
    var _temp, _this, _ret;

    _classCallCheck(this, LinkedIn);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getUrl = function () {
      var _this$props = _this.props,
          redirectUri = _this$props.redirectUri,
          clientId = _this$props.clientId,
          scope = _this$props.scope,
          supportIE = _this$props.supportIE,
          redirectPath = _this$props.redirectPath;

      var scopeParam = '&scope=' + (supportIE ? scope : encodeURI(scope));
      var state = generateRandomString();
      localStorage.setItem(LINKEDIN_OAUTH2_STATE, state);
      var linkedInAuthenLink = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + clientId + '&redirect_uri=' + redirectUri + scopeParam + '&state=' + state;
      if (supportIE) {
        var redirectLink = '' + window.location.origin + redirectPath + '?linkedin_redirect_url=' + encodeURIComponent(linkedInAuthenLink);
        return redirectLink;
      }
      return linkedInAuthenLink;
    }, _this.receiveMessage = function (event) {
      var state = localStorage.getItem(LINKEDIN_OAUTH2_STATE);
      if (event.origin === window.location.origin) {
        if (event.data.errorMessage && event.data.from === 'Linked In') {
          // Prevent CSRF attack by testing state
          if (event.data.state !== state) {
            _this.popup && _this.popup.close();
            return;
          }
          _this.props.onFailure(event.data);
          _this.popup && _this.popup.close();
        } else if (event.data.code && event.data.from === 'Linked In') {
          // Prevent CSRF attack by testing state
          if (event.data.state !== state) {
            console.error('State does not match');
            _this.popup && _this.popup.close();
            return;
          }
          _this.props.onSuccess({ code: event.data.code });
          _this.popup && _this.popup.close();
        }
      }
    }, _this.handleConnectLinkedInClick = function (e) {
      if (e) {
        e.preventDefault();
      }
      _this.props.onClick && _this.props.onClick();
      _this.popup = window.open(_this.getUrl(), '_blank', getPopupPositionProperties({ width: 600, height: 600 }));
      window.removeEventListener('message', _this.receiveMessage, false);
      window.addEventListener('message', _this.receiveMessage, false);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  LinkedIn.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage, false);
    if (this.popup && !this.popup.closed) this.popup.close();
  };

  LinkedIn.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        disabled = _props.disabled,
        children = _props.children,
        renderElement = _props.renderElement,
        style = _props.style;

    if (renderElement) {
      return renderElement({ onClick: this.handleConnectLinkedInClick, disabled: disabled });
    }
    return _react2.default.createElement(
      'button',
      {
        type: 'button',
        onClick: this.handleConnectLinkedInClick,
        className: className,
        disabled: disabled,
        style: style ? style : {
          background: 'none',
          color: 'inherit',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          font: 'inherit',
          outline: 'inherit'
        }
      },
      children
    );
  };

  return LinkedIn;
}(_react.Component);

LinkedIn.propTypes = process.env.NODE_ENV !== "production" ? {
  className: _propTypes2.default.string,
  onFailure: _propTypes2.default.func.isRequired,
  onSuccess: _propTypes2.default.func.isRequired,
  onClick: _propTypes2.default.func,
  disabled: _propTypes2.default.bool,
  clientId: _propTypes2.default.string.isRequired,
  redirectUri: _propTypes2.default.string.isRequired,
  renderElement: _propTypes2.default.func
} : {};


LinkedIn.defaultProps = {
  disabled: false,
  children: null,
  supportIE: false,
  redirectPath: '/linkedin',
  scope: 'r_emailaddress'
};
exports.default = LinkedIn;