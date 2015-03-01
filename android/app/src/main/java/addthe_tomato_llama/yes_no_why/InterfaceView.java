package addthe_tomato_llama.yes_no_why;

import java.util.HashMap;
import java.util.Set;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.view.MotionEventCompat;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;

public class InterfaceView extends SurfaceView {

	private final int offsetX = 10;
	private final int offsetY = -10;
	private final double thresh = 200;
	
	private double theta = 0;
	private double dist = 0;
	
	private Bitmap button;
	private Bitmap circle;
	private Bitmap circle_light;
	
	private JoystickDrawer drawer;
	private SurfaceHolder holder;
	
	private MotionEvent me;
	
	private int locP = -1;
	
	private HashMap<Integer, MotionData> pointers = new HashMap<Integer, MotionData>();
	
	
	public InterfaceView(Context context) {
		super(context);
		Log.d("FnF","Interface View Created");
		button = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
		circle = BitmapFactory.decodeResource(getResources(), R.drawable.circle);
		circle_light = BitmapFactory.decodeResource(getResources(), R.drawable.circle_light);
		drawer = new JoystickDrawer(this);
        holder = getHolder();
        holder.addCallback(new SurfaceHolder.Callback() {

               @Override
               public void surfaceDestroyed(SurfaceHolder holder) {
                      boolean retry = true;
                      drawer.setRunning(false);
                      while (retry) {
                             try {
                                   drawer.join();
                                   retry = false;
                             } catch (InterruptedException e) {
                             }
                      }
               }

               @Override
               public void surfaceCreated(SurfaceHolder holder) {
                      drawer.setRunning(true);
                      drawer.start();
               }

               @Override
               public void surfaceChanged(SurfaceHolder holder, int format,
                             int width, int height) {
               }
               
        });
        
		// TODO Auto-generated constructor stub
	}

	public void onMotionEvent(View v, MotionEvent me) {
		this.me = me;
		if (me != null) {
			if (me != null) {
				int action = MotionEventCompat.getActionMasked(me);
				int point = MotionEventCompat.getPointerId(me,MotionEventCompat.getActionIndex(me));
				switch (action) {
				case MotionEvent.ACTION_DOWN:
				case MotionEvent.ACTION_POINTER_DOWN:
					pointers.put(point,new MotionData(((int)MotionEventCompat.getX(me, point))-offsetX,((int)MotionEventCompat.getY(me, point))-offsetY,System.currentTimeMillis()));
					break;
				case MotionEvent.ACTION_UP:
				case MotionEvent.ACTION_POINTER_UP:
				case MotionEvent.ACTION_OUTSIDE:
				case MotionEvent.ACTION_CANCEL:
					pointers.remove(point);
					break;
				case MotionEvent.ACTION_MOVE:
					pointers.get(point).setXC((int)MotionEventCompat.getX(me, point));
					pointers.get(point).setYC((int)MotionEventCompat.getY(me, point));
					break;
				default:
					Log.d("FnF","Received Extraneous Event: "+action);
				}
			}
			
			
			//x = (int) me.getX()-button.getWidth()/2 - pos[0];
			//y = (int) me.getY()-button.getHeight()/2 - pos[1];
		}
	}
	
	public double getAngle() {
		return theta;
	}
	public double getDist() {
		return dist;
	}
	
	public String actionToString(int action) {
	    switch (action) {
	                
	        case MotionEvent.ACTION_DOWN: return "Down";
	        case MotionEvent.ACTION_MOVE: return "Move";
	        case MotionEvent.ACTION_POINTER_DOWN: return "Pointer Down";
	        case MotionEvent.ACTION_UP: return "Up";
	        case MotionEvent.ACTION_POINTER_UP: return "Pointer Up";
	        case MotionEvent.ACTION_OUTSIDE: return "Outside";
	        case MotionEvent.ACTION_CANCEL: return "Cancel";
	    }
	    return "";
	}
	public void draw(Canvas canvas) {
		int x = 0;
		int y = 0;
		
		int fx = 0;
		int fy = 0;

		
		int[] pos = new int[2];
		getLocationOnScreen(pos);
		if (locP == -1) {
			for (int p : pointers.keySet()) {
				MotionData md = pointers.get(p);
				if (md.getX() < getWidth()) {
					x = (int) md.getX()-circle.getWidth() - pos[0];
					y = (int) md.getY()-circle.getHeight() - pos[1];
					
					//fx = (int) MotionEventCompat.getX(me,me.findPointerIndex(p));
					//fy = (int) MotionEventCompat.getY(me,me.findPointerIndex(p));
					
					fx = md.getXC()-circle_light.getWidth() - pos[0];
					fy = md.getYC()-circle_light.getHeight() - pos[1];
					locP = p;
				}
			}
		} else {
			MotionData md = pointers.get(locP);
			if (pointers.containsKey(locP)) {
				if (md.getX() < getWidth()) {
					x = (int) md.getX()-circle.getWidth() - pos[0];
					y = (int) md.getY()-circle.getHeight() - pos[1];
					
					//fx = (int) MotionEventCompat.getX(me,me.findPointerIndex(locP));
					//fy = (int) MotionEventCompat.getY(me,me.findPointerIndex(locP));
					
					fx = md.getXC()-circle_light.getWidth() - pos[0];
					fy = md.getYC()-circle_light.getHeight() - pos[1];
				}
			} else {
				locP = -1;
			}
		}
		
		if (locP == -1) {
			x = 0;
			y = 0;
		} else {
			dist = Math.sqrt((fx-x)*(fx-x)+(fy-y)*(fy-y));
			if (dist > thresh) {
				fx = x+((int)((thresh/dist)*(fx-x)));
				fy = y+((int)((thresh/dist)*(fy-y)));
				dist = thresh;
				
			}
			dist /= thresh;
			theta = Math.atan2(fy-y, fx-x);
		}
		
		if (canvas != null) {
			
			canvas.drawColor(Color.BLACK);
			if (locP != -1) {
				canvas.drawBitmap(circle, x+circle.getWidth()/2, y+circle.getHeight()/2, null);
				canvas.drawBitmap(circle_light, fx+circle_light.getWidth()/2, fy+circle_light.getHeight()/2, null);
			}
		}
		me = null;
	}
	
	

}
