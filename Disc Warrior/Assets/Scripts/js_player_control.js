#pragma strict
var player_speed : float;
var player_sensitivity : float;
var camera : Camera;
var mouse_current : Vector2;
var mouse_previous : Vector2;
var mouse_deviation : Vector2;
function Start() {
mouse_current = Input.mousePosition;
mouse_previous = mouse_current;
}
function Update () {
if(Input.GetKey(KeyCode.W)) {
	transform.position.z += player_speed*Time.deltaTime;
	}
else if(Input.GetKey(KeyCode.S)) {
	transform.position.z += -player_speed/3f*2*Time.deltaTime;
	}
if(Input.GetKey(KeyCode.A)){
	transform.position.x += -player_speed*Time.deltaTime;
	}
if(Input.GetKey(KeyCode.D)){
	transform.position.x += player_speed*Time.deltaTime;
	}
mouse_current = Input.mousePosition;
mouse_deviation = Vector2(mouse_current.x-mouse_previous.x, mouse_current.y-mouse_previous.y);
camera.transform.Rotate(Vector3(mouse_deviation.x,mouse_deviation.y,0));

mouse_previous = mouse_current;
}
