/**************************************************************************************************
 * BoomPhysics v0.1 - a simple Javascript physics engine
 *     by Shawn Lee (updated 8/26/2014)
 *		  GitHub/Twitter: @sleepysort
 * 
 * Features:
 *  - Basic particle support
 *
 * TODOs:
 *  - Create setters for environment constraints (syntactic sugar)
 *  - Add support for impulses/forces/collisions
 *  - Add rigid bodies
 *  - Include air resistance and ground friction in computation
 *
 * Other considerations:
 *  - Separate rendering engine from actual physics engine?
 *     - Consider performance costs
 *  - Design?
 *     - Determine and adhere to best practices of library design 
 **************************************************************************************************


/**
 * Represents a 2D vector in the simulation.
 */
var Vector = function(x, y) {
	this.x = x;
	this.y = y;
}
Vector.prototype.add = function(o) {
	return new Vector(this.x + o.x, this.y + o.y);
}


/**
 * For getting mouse coordinates.
 */
function mouseCoords(e){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent);

    canvasX = e.pageX - totalOffsetX;
    canvasY = e.pageY - totalOffsetY;

    return { x: canvasX, y: canvasY };
}
HTMLCanvasElement.prototype.mouseCoords = mouseCoords;

/**
 * The physics engine. The canvas should be assigned via getElementById() prior to starting
 */
var PhysicsEngine = {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////////////////////////
	environment: {
		canvas: null,
		gravity: new Vector(0, 1),
		airResistance: 0.05
	},
	fps: 30,
	items: {},
	runtime: null,
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Functions
	///////////////////////////////////////////////////////////////////////////////////////////////
	tic: function(ctx) {
		ctx.clearRect(0, 0, 800, 300);
		for (var i in this.items) {
			var temp = this.items[i];
			temp.draw(ctx);
			temp.update(this.environment);
		}
	},
	
	start: function() {
		var ctx = this.environment.canvas.getContext("2d");
		runtime = setInterval(function() {
			PhysicsEngine.tic(ctx);
		}, 1000 / this.fps);
	},
	
	stop: function() {
		clearInterval(this.runtime);
	},
	
	setCanvasId: function(canvasId) {
		this.environment.canvas = document.getElementById(canvasId);
	},
	
	add: function(item) {
		this.items[item.id] = item;
	},

	remove: function(id) {
		delete this.items[id];
	}, 

	createId: function() {
		var id = "";
		for (var i = 0; i < 16; i++) {
			id += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return id; 
	}
};


/**
 * Represents an arbitrary physics object.
 */
var PhysicsObject = function(x, y, velocity, mass) {
	this.id = PhysicsEngine.createId();
	this.x = x || 0;
	this.y = y || 0;
	this.velocity = velocity || new Vector(0, 0);
	this.force = new Vector(0, 0);
	this.mass = mass || 0;
}
PhysicsObject.prototype.draw = function(ctx) {
	// Pass
}
PhysicsObject.prototype.update = function(env) {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	
	if (this.x < 0) {
			this.x = 0;
			this.velocity.x = -this.velocity.x;
	} else if (this.x > env.canvas.width) {
			this.x = env.canvas.width - 0;
			this.velocity.x = -this.velocity.x;
	}
	
	if (this.y < 0) {
			this.y = 0;
			this.velocity.y = -this.velocity.y;
	} else if (this.y > env.canvas.height ) {
			this.y = env.canvas.height - 0;
			this.velocity.y = -this.velocity.y;
	}
	
	if (this.mass > 0) {
		this.velocity.x += (this.force.x / this.mass) + env.gravity.x;
		this.velocity.y += (this.force.y / this.mass) + env.gravity.y;
		this.force = new Vector(0, 0);
	}
}

 
/**
 * Represents a particle (a point object) in the physics simulation. Has coefficient of restitution (elasticity) and zero size.
 */
var Particle = function(x, y, velocity, mass, cor) {
	this.base = PhysicsObject;
	this.base(x, y, velocity, mass);
	this.cor = cor || 1.0;
}
Particle.prototype = new PhysicsObject;

Particle.prototype.update = function(env) {
	PhysicsObject.prototype.update.call(this, env);
	
	if (this.x == 0 || this.x == env.canvas.width) {
		this.velocity.x *= this.cor;
	}
	
	if (this.y == 0 || this.y == env.canvas.height) {
		this.velocity.y *= this.cor;
	}
}

Particle.prototype.draw = function(ctx) {
	// Pass
}


/**
 * Represents a rigid body object in the physics simulation.
 */
var RigidBody = function() {
	// TODO
}