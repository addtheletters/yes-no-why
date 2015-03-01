package addthe_tomato_llama.yes_no_why;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.http.AndroidHttpClient;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.NfcEvent;
import android.os.AsyncTask;
import android.os.Parcelable;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.EditText;
import android.widget.TextView;
import android.content.IntentFilter.MalformedMimeTypeException;

import android.nfc.NfcAdapter.CreateNdefMessageCallback;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.w3c.dom.Text;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket.PseudoSocketClient;

import static android.nfc.NdefRecord.createMime;


public class MainActivity extends ActionBarActivity {

    public static final String TAG = "NfcDemo";
    TextView waitView;
    NfcAdapter mNfcAdapter;
    String hostname ;
    String starterFriend = "null";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        waitView = (TextView)findViewById(R.id.waitView);
        Animation anim = new AlphaAnimation(0.0f, 1.0f);
        anim.setDuration(500); //You can manage the blinking time with this parameter
        anim.setStartOffset(20);
        anim.setRepeatMode(Animation.REVERSE);
        anim.setRepeatCount(Animation.INFINITE);
        waitView.startAnimation(anim);

        NfcAdapter adapter = NfcAdapter.getDefaultAdapter(this);
        mNfcAdapter = adapter;
        if (adapter != null && adapter.isEnabled()) {
            // adapter exists and is enabled.
            //startActivity(new Intent(this, ControlPad.class));

        }
        else{
            AlertDialog.Builder exitAlertBuilder = new AlertDialog.Builder(this);
            exitAlertBuilder.setTitle("Setting Error").setMessage("You need to turn NFC on").setCancelable(false).setPositiveButton("Exit", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int id) {
                    MainActivity.this.finish();
                }
            });
            AlertDialog exitAlert = exitAlertBuilder.create();
            exitAlert.show();

        }


        //handleIntent(getIntent());

        //waitView.getAnimation().cancel();
    }

    public void connect(View v) {
        Log.d("PSS", "button clicked");
        EditText entry = (EditText)findViewById(R.id.hostname);
        hostname = entry.getText().toString() != null? entry.getText().toString() : hostname;
        try {
            PseudoSocketClient pss = new PseudoSocketClient(new URI("ws://pilotdcrelay.herokuapp.com"), hostname, new MyCallback(this));
            pss.connect();
            ((MyCallback)pss.psc).friend = starterFriend;
            pss.psc.onData("startGame");
        } catch (URISyntaxException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            Log.d("PSS","Something bork");
        }
    }



    @Override
    public void onResume() {
        super.onResume();
        // Check to see that the Activity started due to an Android Beam
        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(getIntent().getAction())) {
            processIntent(getIntent());
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // onResume gets called after this to handle the intent
        setIntent(intent);
    }

    /**
     * Parses the NDEF Message from the intent and prints to the TextView
     */
    void processIntent(Intent intent) {

        Parcelable[] rawMsgs = intent.getParcelableArrayExtra(
                NfcAdapter.EXTRA_NDEF_MESSAGES);
        // only one message sent during the beam
        NdefMessage msg = (NdefMessage) rawMsgs[0];
        String[] data = new String(msg.getRecords()[0].getPayload()).split(" ");

        waitView.setText(data[0]+"  111");

        hostname = data[0];
        starterFriend = data[1];

        connect(null);
    }
/*
    @Override
    protected void onResume() {
        super.onResume();
        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(getIntent().getAction())) {

            Log.d("Thign", "done");
            processIntent(getIntent());
        }
    }

    @Override
    public void onTagDiscovered(Context context, CharSequence text, int duration){

    }

    void processIntent(Intent intent) {
        Log.d("Thign", "done");

        Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
        NdefMessage msg = (NdefMessage) rawMsgs[0]; // record 0 contains the
        // MIME type, record 1 is
        // the AAR, if present
        final String otherID = new String(msg.getRecords()[0].getPayload());
        new AsyncTask<Void, Void, Void>() {
            IOException exc;

            @Override
            protected Void doInBackground(Void... params) {
                waitView.setText("Got NFC :D");

                try {
                    AndroidHttpClient http = AndroidHttpClient.newInstance("Hide and Hunt App");
                    List<NameValuePair> queries = new ArrayList<NameValuePair>(1);
                    queries.add(new BasicNameValuePair("reg_id1", MainActivity.gcmRegistrationId));
                    queries.add(new BasicNameValuePair("reg_id2", otherID));
                    HttpPost req = new HttpPost(MainActivity.SERVER + "/tag/" + Game.getInstance().gameID + "?" + URLEncodedUtils.format(queries, "UTF-8"));
                    HttpResponse resp = http.execute(req);

                    if (resp.getStatusLine().getStatusCode() != 200) {
                        throw new IOException("HTTP error");
                    }
                } catch (IOException e) {
                    exc = e;
                }
                return null;
            }

            protected void onPostExecute(Void result) {
                if (exc != null) {
                    exc.printStackTrace();
                    Toast.makeText(MainActivity.this.getApplicationContext(), "Couldn't reach server :(", Toast.LENGTH_LONG).show();
                }
                Toast.makeText(MainActivity.this.getApplicationContext(), "rekt", Toast.LENGTH_LONG).show();
            };
        }.execute();
    }*/
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


}
