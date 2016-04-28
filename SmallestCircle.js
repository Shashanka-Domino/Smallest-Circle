// JavaScript Document
/* 
Shashanka Srirama
*/

"use strict";


/* 
 * Returns the smallest circle that encloses all the given points. Randomized.
 * Input: A list of points, where each point is an object {x: float, y: float} Typical (x,y) axis, e.g. [{x:0,y:5}, {x:3.1,y:-2.7}].
 * Output: A circle object of the form {x: float, y: float, r: float}. r = radius
 * Note: If 0 points are given, null is returned. If 1 point is given, a circle of radius 0 is returned.
 */
function makeCircle(points) {
	// List is cloned to keep the caller's data, do Knuth shuffle
	var shuffled = points.slice();
	for (var i = points.length - 1; i >= 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		j = Math.max(Math.min(j, i), 0);
		var temp = shuffled[i];
		shuffled[i] = shuffled[j];
		shuffled[j] = temp;
	}
	
	// Progressively add points to circle or recompute circle
	var c = null;
	for (var i = 0; i < shuffled.length; i++) {
		var p = shuffled[i];
		if (c == null || !isInCircle(c, p))
			c = makeCircleOnePoint(shuffled.slice(0, i + 1), p);
	}
	return c;
}


// 1 boundary point known
function makeCircleOnePoint(points, p) {
	var c = {x: p.x, y: p.y, r: 0};// radius is 0
	for (var i = 0; i < points.length; i++) {
		var q = points[i];
		if (!isInCircle(c, q)) {
			if (c.r == 0)
				c = makeDiameter(p, q);
			else
				c = makeCircleTwoPoints(points.slice(0, i + 1), p, q);
		}
	}
	return c;
}


// 2 boundary points known
function makeCircleTwoPoints(points, p, q) {
	var temp = makeDiameter(p, q);
	var containsAll = true;
	for (var i = 0; i < points.length; i++)
		containsAll = containsAll && isInCircle(temp, points[i]);
	if (containsAll)
		return temp;
	
	var left = null;
	var right = null;
	for (var i = 0; i < points.length; i++) {
		var r = points[i];
		var cross = crossProduct(p.x, p.y, q.x, q.y, r.x, r.y);
		var c = makeCircumcircle(p, q, r);
		if (c == null)
			continue;
		else if (cross > 0 && (left == null || crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) > crossProduct(p.x, p.y, q.x, q.y, left.x, left.y)))
			left = c;
		else if (cross < 0 && (right == null || crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) < crossProduct(p.x, p.y, q.x, q.y, right.x, right.y)))
			right = c;
	}
	return right == null || left != null && left.r <= right.r ? left : right;
}


function makeCircumcircle(p0, p1, p2) {
	// Mathematical algorithm for  Circumscribed circle
	var ax = p0.x, ay = p0.y;
	var bx = p1.x, by = p1.y;
	var cx = p2.x, cy = p2.y;
	var d = (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) * 2;
	if (d == 0)
		return null;
	var x = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
	var y = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
	return {x: x, y: y, r: distance(x, y, ax, ay)};
}


function makeDiameter(p0, p1) {
	return {
		x: (p0.x + p1.x) / 2,
		y: (p0.y + p1.y) / 2,
		r: distance(p0.x, p0.y, p1.x, p1.y) / 2
	};
}


/* Mathematical functions */

var EPSILON = 1e-12;

function isInCircle(c, p) {
	return c != null && distance(p.x, p.y, c.x, c.y) < c.r + EPSILON;
}


// Returns twice the signed area of the triangle defined by (x0, y0), (x1, y1), (x2, y2)
function crossProduct(x0, y0, x1, y1, x2, y2) {
	return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
}


function distance(x0, y0, x1, y1) {
	return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}