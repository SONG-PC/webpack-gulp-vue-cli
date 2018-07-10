'use strict';

var _Greeter = require('./Greeter.js');

var _Greeter2 = _interopRequireDefault(_Greeter);

require('./main.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//var greeter = require('./Greeter.js');
document.querySelector("#root").appendChild((0, _Greeter2.default)());
//document.querySelector("#root").style.backgroundUrl=require("./2.jpg");;

//import image  from './timg.jpg';
//import image2  from './timg2.jpg';