package addthe_tomato_llama.yes_no_why;

import java.net.URI;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket.PseudoSocketClient;
import addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket.PseudoSocketCallback;

public class MyCallback extends PseudoSocketCallback {
	
	public Activity parent;
    public String friend;
	
	public MyCallback(Activity a) {
		parent = a;
	}
	
	public void onOpen() {
		Log.d("PSS","it opened and i am too lazy to implelement the other mehtods");
		if (owner != null) {
			//owner.ask(new MyQuestion());
			//owner.sendData("woah data");
		
		}
		((MyApplication)parent.getApplication()).registerPSC(owner);
		//Intent intent = new Intent(parent, DataSender.class);
		//parent.startActivity(intent);
		//boo-2
			
	
	}
	
	@Override
	public void onData(String msg) {
/*		if (msg.equals("dataSelect")) {
			Intent intent = new Intent(parent, PromptActivity.class);
			parent.startActivity(intent);
		}*/
        PseudoSocketClient psc = ((MyApplication)parent.getApplication()).getPSC();

        String[] data = msg.split(" ");

		if (data[0].equals("startGame")) {
            friend = data[1];
            Log.d("callback friend", friend);
			Intent intent = new Intent(parent, ControlPad.class);
			Log.d("FnF", "Starting ControlPad");
			parent.startActivity(intent);
		}

        if (data[0].equals("request")){
            Log.d("sent",friend);
            psc.sendData("join " +  friend);
        }
        if(data[0].equals("acknowledgement")){
            Log.d("yay", "good");
        }

        if(data[0].equals("death")){
            Log.d("redkt", "Ggg");

        }


	}
	
	public void onClose() {
		Log.d("FnF","onClose");
		((MyApplication)parent.getApplication()).killLimited();
	}
	
}
