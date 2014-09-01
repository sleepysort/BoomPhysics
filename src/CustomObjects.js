/**
 * Custom physics objects using BoomPhysics for demonstration.
 * by Shawn Lee
 */

// An explosive object
var Bomb = function(x, y, velocity, mass, cor, timer, magnitude) {
	this.base = Particle;
	this.base(x, y, velocity, mass, cor);
	this.timer = timer || 100;
	this.magnitude = magnitude || 600;
}
Bomb.prototype = new Particle;

Bomb.prototype.update = function(env) {
	Particle.prototype.update.call(this, env);
	if (this.timer == 0) {
		for (var i in PhysicsEngine.items) {
			var item = PhysicsEngine.items[i];
			var dx = item.x - this.x;
			var dy = item.y - this.y;
			var hyp = Math.sqrt(dx * dx + dy * dy);
			var itemMag = this.magnitude / hyp ;
			item.force = item.force.add(new Vector(itemMag * (dx / hyp), itemMag * (dy / hyp)));
			PhysicsEngine.remove(this.id);
		}
	} else {
		this.timer--;
	}
}

Bomb.prototype.draw = function(ctx) {
	if ((this.timer % 10) < 5) {
		ctx.fillStyle = "#FF0000";
	} else {
		ctx.fillStyle = "#222222";
	}

	if (this.timer > 0) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
		ctx.fill()
		ctx.closePath();
	} else {
		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 400, 0, 2*Math.PI);
		ctx.fill()
		ctx.closePath();
	}
}

// A particle with a customizable color;
var ColoredParticle = function(x, y, velocity, mass, cor, col) {
	this.base = Particle;
	this.base(x, y, velocity, mass, cor);
	this.col = col || "#000000";
}
ColoredParticle.prototype = new Particle;

ColoredParticle.prototype.update = function(env) {
	Particle.prototype.update.call(this, env);
}

ColoredParticle.prototype.draw = function(ctx) {
	ctx.fillStyle = this.col;
	ctx.beginPath();
	ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
}