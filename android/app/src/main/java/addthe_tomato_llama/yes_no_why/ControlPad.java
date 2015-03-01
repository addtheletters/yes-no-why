package addthe_tomato_llama.yes_no_why;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.NfcEvent;
import android.os.Parcelable;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;


import addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket.PseudoSocketClient;

import static android.nfc.NdefRecord.createMime;


public class ControlPad extends LimitedActivity implements NfcAdapter.CreateNdefMessageCallback {

    private InterfaceView view;
    private LinearLayout ll;
    private PseudoSocketClient psc;
    private boolean newInst = true;

    private Timer t;
    TextView txtX, txtY;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_control_pad);



        view = new InterfaceView(this);
        ll = new LinearLayout(this);
        ll.addView(view);

        final Activity that = this;
        view.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                view.onMotionEvent(v,event);
                if (psc != null) {
                    //psc.sendData("set "+(event.getX()/view.getWidth())+" "+(event.getY()/view.getHeight()));
                } else {
                    psc = ((MyApplication)that.getApplication()).getPSC();
                    Log.d("PSS","Fetching PSC - dis: "+ view.getDist() + ", ang: " + view.getAngle());
                }
                return true;
            }
        });

        t = new Timer();
        t.scheduleAtFixedRate(new TimerTask() {

            @Override
            public void run() {
                //Log.d("PSS","Fetching PSC Fixed Rate");
                if (psc != null) {
                    psc.sendData("input " + view.getXx() + " " + view.getYy());
                } else {
                    psc = ((MyApplication)that.getApplication()).getPSC();
                }
            }

        }, 0, 200);

        setContentView(ll);

        newInst = false;

        txtX = (TextView)findViewById(R.id.TextViewX);
        txtY = (TextView)findViewById(R.id.TextViewY);


        NfcAdapter adapter = NfcAdapter.getDefaultAdapter(this);
        if (adapter != null && adapter.isEnabled()) {
            // adapter exists and is enabled.
            //startActivity(new Intent(this, ControlPad.class));

        }
        else{

        }


        //handleIntent(getIntent());

        adapter.setNdefPushMessageCallback(this, this);


    }
    @Override
    protected void onPause() {
        super.onPause();
        if (t != null) {
            t.cancel();
            t = null;
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle b) {
        super.onSaveInstanceState(b);
        b.putBoolean("new", newInst);
    }
/*
    public void connect(View v) {
        Log.d("PSS", "button clicked");
        //EditText entry = (EditText)findViewById(R.id.hostname);
        String hostname="";
        try {
            PseudoSocketClient pss = new PseudoSocketClient(new URI("ws://pilotdcrelay.herokuapp.com"), hostname, new MyCallback(this));
            pss.connect();
        } catch (URISyntaxException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            Log.d("PSS","Something bork");
        }
    }

*/

    public void death(){
        view.setOnTouchListener(null);
        RelativeLayout lays = (RelativeLayout)findViewById(R.id.thingLayout);
        TextView wasted = new TextView(this);
        wasted.setText("Wasted");
        wasted.setTextSize(50);
        wasted.setTextColor(Color.RED);
        lays.addView(wasted,5);
        Animation anim = new AlphaAnimation(0.0f, 1.0f);
        anim.setDuration(500); //You can manage the blinking time with this parameter
        anim.setStartOffset(20);
        wasted.startAnimation(anim);
    }

    @Override
    public NdefMessage createNdefMessage(NfcEvent event) {
        String text = psc.host+" "+(psc.UID);
        NdefMessage msg = new NdefMessage(
                new NdefRecord[] { createMime(
                        "application/vnd.com.example.android.beam", text.getBytes())
                        /**
                         * The Android Application Record (AAR) is commented out. When a device
                         * receives a push with an AAR in it, the application specified in the AAR
                         * is guaranteed to run. The AAR overrides the tag dispatch system.
                         * You can add it back in to guarantee that this
                         * activity starts when receiving a beamed message. For now, this code
                         * uses the tag dispatch system.
                         */
                        //,NdefRecord.createApplicationRecord("com.example.android.beam")
                });
        return msg;
    }

    @Override
    public void onResume() {
        super.onResume();
        // Check to see that the Activity started due to an Android Beam

    }

    @Override
    public void onNewIntent(Intent intent) {
        // onResume gets called after this to handle the intent
        setIntent(intent);
    }


}
