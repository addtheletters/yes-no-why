package addthe_tomato_llama.yes_no_why;

public class MotionData {
	public int X_i;
	public int Y_i;
	
	public int X_c;
	public int Y_c;
	
	public long T_i;
	
	public boolean hit;
	
	public MotionData(int x,int y,long t) {
		X_i = x;
		Y_i = y;
		X_c = x;
		Y_c = y;
		T_i = t;
		hit = true;
	}
	
	
	public long getTime() {
		return T_i;
	}
	
	public int getX() {
		return X_i;
	}
	
	public int getY() {
		return Y_i;
	}
	
	public int getXC() {
		return X_c;
	}
	
	public int getYC() {
		return Y_c;
	}
	
	public void setXC(int xc) {
		X_c = xc;
	}
	
	public void setYC(int yc) {
		Y_c = yc;
	}
	
	public boolean getHit() {
		return hit;
	}
	
	public void setHit(boolean h) {
		hit = h;
	}
	
	
}
