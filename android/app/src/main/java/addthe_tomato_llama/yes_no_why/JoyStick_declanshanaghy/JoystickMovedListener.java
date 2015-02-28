package addthe_tomato_llama.yes_no_why.JoyStick_declanshanaghy;

public interface JoystickMovedListener {
    public void OnMoved(int pan, int tilt);
    public void OnReleased();
    public void OnReturnedToCenter();
}