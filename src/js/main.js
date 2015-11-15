//import Pt from "./libs/pt.js";
import verge from "./libs/verge.js";


var space, form, center, viewPort, bot, lastTime, colorIndex, mouseSpeed

var pt = document.querySelectorAll("#pt")

lastTime = 0
colorIndex = 0

class Main {
	constructor(options = {}) {
  	
  		buildPt()
		window.addEventListener('resize', function(event){
		  updatePt()
		});
		window.addEventListener('mousemove', function(event){
		  mouseSpeed = getMouseSpeed(event);
		});
  }
}

function buildPt() {

	//// 1. Define Space and Form
	var colors = ["#ff2d5d", "#42dc8e", "#2e43eb", "#ffe359"]

	space = new CanvasSpace("demo", "#ddd" ).display();

	form = new Form( space );
	form.stroke( false );


	//// 2. Create Elements

	// A Shape is a kind of Vector
	function Shape() {
	  Vector.apply( this, arguments ); // call Vector's constructor
	  this.age = 0
	  this.maxAge = 250
	  this.size =  0
	  this.color = colors["a"+Math.ceil(Math.random()*4)]
	}
	Util.extend( Shape, Vector ); // extends Vector class

	// define an animate function so it can be animated when added into Space
	Shape.prototype.animate = function(time, fps, context) {
	  if (this.age++ > this.maxAge) space.remove(this)

	  // draw shapes
	  form.fill( Util.toRGBColor( this.color, true ) )
	  var largerSize = space.size.x > space.size.x ? space.size.x : space.size.y
	  var progress = this.age / this.maxAge
	  this.size = Math.pow( progress, 1/3 ) * largerSize
	  form.point( this, this.size, true )

	}

    bot = {
        animate: function( time, fs, context ) {
	  	  // add two Dust into space
		  if ( ( time - lastTime ) > mouseSpeed ) {
				var me = new Shape( mousex, mousey )
				me.color = colors[colorIndex]
				space.add( me )
				colorIndex = colorIndex < 3 ? colorIndex+1 : 0;
				lastTime = time
			}	   
        }
    }

	center = space.size.$divide(2)
	console.log(center.x)

	// 4. Start playing
	space.add(bot);
	space.play();

}

function updatePt() {
	viewPort = {
		x: verge.viewportW(),
		y: verge.viewportH()
	}

	center = space.size.$divide(2)

}

var mrefreshinterval = 500; // update display every 500ms
var lastmousex=-1; 
var lastmousey=-1;
var lastmousetime;
var mousetravel = 0;
var mousex, mousey;

function getMouseSpeed(e) {
	mousex = e.pageX;
	mousey = e.pageY;
	if (lastmousex > -1) {
		mousetravel = Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );
	}
	lastmousex = mousex;
	lastmousey = mousey;

	mousetravel = mousetravel>100 ? 100 : mousetravel*5
	mousetravel = ( 100 - mousetravel ) / 100

	mouseSpeed = mousetravel*4000
	mouseSpeed = mouseSpeed<50 ? 50 : mouseSpeed
	return mouseSpeed;
}

document.addEventListener('DOMContentLoaded', event => new Main)
