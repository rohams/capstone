package com.drawellipserohamalg;

import java.awt.BasicStroke;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Toolkit;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.geom.Line2D;
import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JApplet;
import javax.swing.JFrame;

public class DrawEllipseRohamAlg extends JApplet {
	
	// Hard coded focus
	private static Focus a = new Focus(0,1);
	private static Focus b = new Focus(2,0);
	private static Focus c = new Focus(3,5);
	private static Focus d = new Focus(5,5);
	private static Focus e = new Focus(5,7);
	
	// Add foci into one array
	private static List<Focus> foci = new ArrayList<Focus>();
	
	private final static double C = 25;
	private final static double STEPSIZE = 0.05;
	private final static double THRESHOLD = 0.1;
	
	private static List<Double> px = new ArrayList<Double>();
	private static List<Double> py = new ArrayList<Double>();
	private static double ax;
	private static double ay;
	
	private static Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
	private static int windowWidth = screenSize.width/2;
	private static int windowHeight = screenSize.height - 40;
	private static Point2D origin;
	
	private final int xScale = 10;
	private final int yScale = 10;
	
	/** The formula to change coordinate to screen coordinate
	 * is: 
	 * xOnScreenCoord = yourXValue*yourXScale + origin.getX()
	 * yOnScreenCoord = -yourYValue*yourYScale + origin.getY() **/
	
	// Return foci as Line2D in screen coord
	private List<Line2D> getFociAsLine() {
		List<Focus> fociInScreenCoord = new ArrayList<Focus>();
		List<Line2D> fociAsLine = new ArrayList<Line2D>();

		for (int i = 0; i < foci.size(); i++) {
			// Don't forget the -ve on y
			fociInScreenCoord.add(new Focus(foci.get(i).getPoint().getX()*xScale + origin.getX(),
					-foci.get(i).getPoint().getY()*yScale + origin.getY()) );
		}
		
	     for (int i = 0; i < fociInScreenCoord.size(); i++) {
	    	 fociAsLine.add(new Line2D.Double(fociInScreenCoord.get(i).getPoint(),fociInScreenCoord.get(i).getPoint()));
	     }
	     
	     return fociAsLine;
	}
	
	// Return the coordinate of px py in screen coordinate in a list
	private List<Point2D> getPointpxpy() {
		List<Point2D> pxpy = new ArrayList<Point2D>();
		if (px.size() != py.size()) {
			System.out.println("ERROR: px size and py size does not match. Program exiting");
			System.exit(ERROR);
		} else {
			for (int i = 0; i < px.size(); i++)
				pxpy.add(new Point2D.Double(px.get(i)*xScale + origin.getX(), -py.get(i)*yScale + origin.getY()));
		}
		return pxpy;
	}
	
	public void paint(Graphics g) {
		Graphics2D g2 = (Graphics2D) g;
		final BasicStroke stroke = new BasicStroke(3.0f);
		final BasicStroke fwStroke = new BasicStroke(2.0f);
		
	    g2.draw(new Line2D.Double(origin.getX(), 0, origin.getX(), windowHeight));
	    g2.draw(new Line2D.Double(0, origin.getY(), windowWidth, origin.getY()));
	     
	     
	    // draw foci. Set it as a line by giving the same point twice in screen position
	    List<Line2D> fociAsLine = getFociAsLine();
	    g2.setStroke(stroke);
	    for (int i = 0; i < fociAsLine.size(); i++) {
	    	g2.draw(fociAsLine.get(i));
	    }
	    
	    // draw point pxpy in screen coordinate
	    g2.setStroke(fwStroke);
	    Point2D axay = new Point2D.Double(ax*xScale + origin.getX(),-ay*yScale + origin.getY());
	    Line2D pointaxay = new Line2D.Double(axay,axay);
	    g2.draw(pointaxay);
	    
	    // draw ellipse. pxpy is in screen coordinate
	    g2.setStroke(stroke);
	    List<Point2D> pxpy = getPointpxpy();
	  /*  // Turn it to a connected line
	    List<Line2D> linepxpy = new ArrayList<Line2D>();
	    for (int i = 0; i < pxpy.size(); i++) {
	    	if (i == pxpy.size()-1)
	    		linepxpy.add(new Line2D.Double(pxpy.get(i), pxpy.get(0)));
	    	else
	    		linepxpy.add(new Line2D.Double(pxpy.get(i), pxpy.get(i+1)));
	    }
	 */   
	    // Turn it to a Line2D
	    List<Line2D> linepxpy = new ArrayList<Line2D>();
	    for (int i = 0; i < pxpy.size(); i++) {
	    		linepxpy.add(new Line2D.Double(pxpy.get(i), pxpy.get(i)));
	    }
	    
	    for (int i = 0; i < linepxpy.size(); i++) {
	    	g2.draw(linepxpy.get(i));
	    	if (i == linepxpy.size() - 1)
	    		System.out.println("Finish drawing ellipse line");
	    }
	    
	}
	
	public static void main(String[] args) {
		
		JFrame f = new JFrame("DrawEllipseRohamAlg");
		f.addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) { System.exit(0); }
		});
		JApplet applet = new DrawEllipseRohamAlg();
		f.getContentPane().add("Center", applet);
		applet.init();
		f.pack();
		f.setSize(new Dimension(windowWidth,windowHeight));
		f.setVisible(true);
		
		origin = new Point2D.Double(windowWidth/2, windowHeight/2);
		
		foci.add(a);
		foci.add(b);  foci.add(c); foci.add(d); foci.add(e);
		
		for (int i = 0; i < foci.size(); i++) {
			ax += foci.get(i).getPoint().getX();
		}
		ax = ax/foci.size();
		
		for (int i = 0; i < foci.size(); i++) {
			ay += foci.get(i).getPoint().getY();
		}
		ay = ay/foci.size();
		
		for (double i = ax; i <= C; i += STEPSIZE) {
			for (double j = ay; j <= C; j += STEPSIZE) {
				Calculate.sumOfDistance(foci, i, j);
			}
		}
		
		for (double i = -C; i <= ax; i += STEPSIZE) {
			for (double j = ay; j <= C; j += STEPSIZE) {
				Calculate.sumOfDistance(foci, i, j);
			}
		}
		
		for (double i = ax; i <= C; i += STEPSIZE) {
			for (double j = -C; j <= ay; j += STEPSIZE) {
				Calculate.sumOfDistance(foci, i, j);
			}
		}
		
		for (double i = -C; i <= ax; i += STEPSIZE) {
			for (double j = -C; j <= ay; j += STEPSIZE) {
				Calculate.sumOfDistance(foci, i, j);
			}
		}
	}
	
	private static class Calculate {
		
		private static void sumOfDistance(List<Focus> foci, double i, double j) {
			double d = 0;	
			for (int k = 0; k < foci.size(); k++) {
					d += Math.sqrt( Math.pow(foci.get(k).getPoint().getX() - i, 2) + Math.pow(foci.get(k).getPoint().getY() - j, 2) );
				}
			d -= C;
			if (Math.abs(d) < THRESHOLD) {
				px.add(i);
				py.add(j);
			}
		}
	}
	
}