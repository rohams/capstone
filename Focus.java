package com.drawellipserohamalg;

import java.awt.Point;
import java.awt.geom.Point2D;

public class Focus {
	
	// For this example we use Point. Later will use LatLong.
	private final Point2D point;
	private final double weight;
	
	// Constructor
	public Focus(double x, double y, double weight) {
		this.point = new Point2D.Double(x,y);
		this.weight = weight;
	}
	
	// Constructor
	public Focus(double x, double y) {
		this.point = new Point2D.Double(x,y);
		this.weight = 1;
	}
	
	// Constructor
	public Focus(Point2D f, double weight) {
		this.point = f;
		this.weight = weight;
	}
	
	// Constructor
	public Focus(Point2D f) {
		this.point = f;
		this.weight = 1;
	}
	
	public Point2D getPoint() {
		return this.point;
	}
	
	public double getWeight() {
		return this.weight;
	}
}
