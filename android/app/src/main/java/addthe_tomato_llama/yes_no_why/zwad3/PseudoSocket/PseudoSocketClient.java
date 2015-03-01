package addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket;
import java.net.URI;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import android.util.Log;
public class PseudoSocketClient extends WebSocketClient {

    public  String 				      host;
    public  String  			      UID;
    public  String 				      address;
    public  int   			          state;
    public 	boolean                   hasConnected = false;

    private int     	    		  tag          = 1;
    private Timer                     tim;
    public PseudoSocketCallback      psc;
    private HashMap<String, Question> questions    = new HashMap<String, Question>();

    public String genTag() {
        return ""+(tag++);
    }

    public PseudoSocketClient(URI serverURI, String hostname, PseudoSocketCallback psc) {
        super(serverURI);
        this.host = hostname;
        this.psc = psc;
        psc.registerOwner(this);
        Log.d("PSS","instantiated");
    }

    public void startHeartbeat() {
        if (tim == null) {
            tim = new Timer();
        } else {
            tim.cancel();
            tim = new Timer();
        }
        tim.scheduleAtFixedRate(new Heartbeat(this), 0, 30000);
    }

    public void register() {
        send("reg client");
        connectToHost();
    }

    public void connectToHost() {
        send("req "+UID+" "+host);
    }

    public void stopHeartbeat() {
        if (tim != null) {
            tim.cancel();
            tim = null;
        }
    }

    public void ask(Question a) {
        String tag = genTag();
        questions.put(tag, a);
        if (state == 1) {
            send("ask "+tag+" "+host+" "+a.question());
        }
    }

    public void sendData(String data) {
        if (state == 1) {
            send("tel "+host+" "+data);
        }
    }

    @Override
    public void onClose(int arg0, String arg1, boolean arg2) {
        stopHeartbeat();
        if (!hasConnected) {
            state = 2;
            psc.onConnectionFailure();
        } else {
            state = 3;
            psc.onClose();
        }

    }

    @Override
    public void onError(Exception arg0) {
        // TODO Auto-generated method stub
        Log.d("PSS",arg0.toString());
        arg0.printStackTrace();
    }

    @Override
    public void onMessage(String datum) {
        String[] msg = datum.split(" ");
        String cmd = msg[0];
        String tag = msg[1];
        String qdest = msg[2];
        String data = "";
        for (int i = 2; i < msg.length-1; i++) {
            data+=msg[i]+" ";
        }
        data+=msg[msg.length-1];
        String qdata = "";
        for (int i = 3; i < msg.length-1; i++) {
            qdata+=msg[i]+" ";
        }
        qdata+=msg[msg.length-1];
        Log.d("PSS","Received: "+datum);
        switch (cmd) {
            case "uid":
                this.UID = data;
                break;
            case "acc":
                if (data.equals("true")) {
                    this.state = 1;
                    this.psc.onOpen();
                } else {
                    this.state = 2;
                    this.psc.onConnectionFailure();
                }
                break;
            case "frm":
                if (tag.equals(this.host)) {
                    this.psc.onData(data);
                }
                break;
            case "ans":
                if (qdest.equals(this.host)) {
                    questions.get(tag).response(qdata);
                    questions.remove(tag);
                }
                break;
            case "brk":
                if (hasConnected) {
                    psc.onClose();
                } else {
                    psc.onConnectionFailure();
                }
                break;
            case "ask":
                if (host.equals(qdest)) {
                    send("ans "+tag+" "+qdest+" "+psc.onQuestion(qdata) );
                }
                break;
        }


    }

    @Override
    public void onOpen(ServerHandshake arg0) {

        Log.d("PSS","Opened");
        hasConnected = true;
        register();
        startHeartbeat();

    }


    private class Heartbeat extends TimerTask {

        private WebSocketClient wc;

        public Heartbeat(WebSocketClient wc) {
            this.wc = wc;
        }

        @Override
        public void run() {
            wc.send("hrt");
        }
    }
}
