package addthe_tomato_llama.yes_no_why.zwad3.PseudoSocket;

public class PseudoSocketCallback {

    protected PseudoSocketClient owner = null;

    public void registerOwner(PseudoSocketClient psc) {
        this.owner = psc;
    }


    public void   onConnectionFailure() {

    }

    public void   onOpen() {

    }

    public void   onClose() {

    }

    public void   onData(String data) {

    }

    public String onQuestion(String question) {
        return "Unimplemented";
    }

}
