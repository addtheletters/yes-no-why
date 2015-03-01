package addthe_tomato_llama.yes_no_why;

import android.graphics.Canvas;
import android.view.SurfaceView;
import android.view.View;

public class JoystickDrawer extends Thread {

	 private SurfaceView view;
     private boolean running = false;
    
     public JoystickDrawer(SurfaceView view) {
           this.view = view;
     }

     public void setRunning(boolean run) {
           running = run;
     }

     @Override
     public void run() {
           while (running) {
                  Canvas c = null;
                  try {
                         c = view.getHolder().lockCanvas();
                         synchronized (view.getHolder()) {
                                view.draw(c);
                         }
                  } finally {
                         if (c != null) {
                                view.getHolder().unlockCanvasAndPost(c);
                         }
                  }
           }
     }
}
