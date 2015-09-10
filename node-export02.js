// exports
function Hello(){
	var name;

	this.setName = function(aName){
		name = aName;
	}

	this.sayHello = function(){
		console.log('Hello ' + name);
	}
}

module.exports = Hello;