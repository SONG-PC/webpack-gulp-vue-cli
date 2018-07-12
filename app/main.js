
//var greeter = require('./Greeter.js');
import greeter from './Greeter.js';
import jq from './lib/jq.js';
//import image  from './timg.jpg';
//import image2  from './timg2.jpg';
require('./main.css');
import './style.scss';
jq("#root").html(greeter());
jq("#root").on("click", function () {

    require.ensure([], function () {
        var liangliang = require('./Async.js'); //baidumap.js放在我们当前目录下
        liangliang();
    });


});

//document.querySelector("#root").style.backgroundUrl=require("./2.jpg");
