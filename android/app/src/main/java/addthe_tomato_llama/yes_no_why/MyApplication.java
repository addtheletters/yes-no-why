package addthe_tomato_llama.yes_no_why;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket.PseudoSocketClient;
public class MyApplication extends Application {

    private PseudoSocketClient psc;
    private Activity active;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("PSS","Application Created!");
    }

    public void registerPSC(PseudoSocketClient psc) {
        this.psc = psc;
    }

    public PseudoSocketClient getPSC() {
        return this.psc;
    }

    public void startActivity(Activity a) {
        if (active != null) {
            active.finish();
        }
        this.active = a;
    }

    public void killLimited() {
        if (active != null) {
            active.finish();
            active = null;
        }
    }
}
