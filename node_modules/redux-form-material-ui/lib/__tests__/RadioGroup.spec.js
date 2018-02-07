'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _expectJsx = require('expect-jsx');

var _expectJsx2 = _interopRequireDefault(_expectJsx);

var _Radio = require('material-ui/Radio');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.noop');

var _lodash2 = _interopRequireDefault(_lodash);

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _RadioGroup = require('../RadioGroup');

var _RadioGroup2 = _interopRequireDefault(_RadioGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_expect2.default.extend(_expectJsx2.default);

describe('RadioGroup', function () {
  it('has a display name', function () {
    (0, _expect2.default)(_RadioGroup2.default.displayName).toBe('ReduxFormMaterialUIStyle');
  });

  it('renders a RadioGroup', function () {
    (0, _expect2.default)(new _RadioGroup2.default({
      input: {
        name: 'myRadio',
        value: 'Foo',
        onChange: { noop: _lodash2.default }
      }
    }).render()).toEqualJSX(_react2.default.createElement(_Radio.RadioGroup, {
      name: 'myRadio',
      value: 'Foo',
      onChange: _lodash2.default,
      ref: function ref() {}
    }));
  });

  it('provides getRenderedComponent', function () {
    var dom = _testUtils2.default.renderIntoDocument(_react2.default.createElement(_RadioGroup2.default, {
      input: { name: 'myRadio', value: 'Foo' }
    }));

    var element = _testUtils2.default.findRenderedComponentWithType(dom, _RadioGroup2.default);
    (0, _expect2.default)(element.getRenderedComponent).toBeA('function');
    (0, _expect2.default)(element.getRenderedComponent()).toExist();
  });
});