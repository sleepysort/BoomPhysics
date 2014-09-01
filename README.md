BoomPhysics v0.1
================

BoomPhysics is a simple Javascript physics engine that renders to HTML5 canvas.


#How to Use
Simply include the BoomPhysics.js file in your HTML document, pass the ID of the canvas to PhysicsEngine.setCanvasId(), add the physics object, then start!

To create custom physics objects, subclass one of the BoomPhysics objects (PhysicsObject, Particle, RigidBody [Not Available Yet]), and override the .update() and .draw() methods.

#Notes
Still very early development; no friction, no air resistance, no rigid bodies.

Any suggestions/comments/criticisms are welcome!