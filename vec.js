// vector help functions
var vec = {};

vec.WARN_DIV_ZERO = true;

vec.createVec = function(x_component, y_component){
	if(!x_component)
		x_component = 0;
	if(!y_component)
		y_component = 0;
	return {
		x: x_component,
		y: y_component
	}
}

vec.createVecPolar = function(rad, theta){
	if(!rad){
		x_component = 0;
		y_component = 0;
	}

	x_component = rad * Math.cos(theta);
	y_component = rad * Math.sin(theta);

	return {
		x: x_component,
		y: y_component
	}
}

vec.sum = function ( pt1, pt2 ){
	return this.createVec( pt1.x + pt2.x, pt1.y + pt2.y );
}

vec.negate = function ( pt ){
	return this.createVec( -pt.x, -pt.y );
}

vec.subtract = function ( pt1, pt2 ){
	return this.sum(pt1, this.negate(pt2));
}

vec.midpoint = function ( pt1, pt2 ){
	return this.createVec( (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2 );
}

vec.magnitudeSquared = function ( pt ){
	return Math.pow(pt.x, 2) + Math.pow(pt.y, 2);
}

vec.magnitude = function( pt ){
	return Math.sqrt(this.magnitudeSquared(pt));
}

vec.distSquared = function ( pt1, pt2 ){
	return this.magnitudeSquared(this.subtract(pt1, pt2));
}

vec.scale = function ( pt, scalar ){
	return this.createVec( pt.x * scalar, pt.y * scalar );
}

vec.normalize = function ( pt, dist ){
	if(!dist){
		dist = 1;
	}
	var mag = Math.sqrt(this.magnitudeSquared(pt));
	if( this.WARN_DIV_ZERO && mag == 0 ){
		console.log("Vector magnitude of zero detected while normalizing. (may cause divide by zero errors)");
	}
	return this.scale(pt, dist / mag);
}

vec.randDeviation = function ( pt, amount ){
	return this.createVec( pt.x + (Math.random() * amount) - amount/2, pt.y + (Math.random() * amount) - amount/2 );
}

vec.dotProd = function( pt1, pt2 ){
	return pt1.x * pt2.x + pt1.y * pt2.y;
}

function getVecLib(){
	return vec;
}
