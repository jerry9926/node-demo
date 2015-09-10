// require
var Hello = require('./node-export01').Hello;

var a = new Hello();

a.setName('Peter');
a.sayHello();