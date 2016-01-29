#pragma strict
var dungeon_size : Vector2;
var dungeon_grid : int[,];
var room_grid : int[,];
var remaining_rooms : int;
var generated_rooms : int;
var room_size_min : Vector2;
var room_size_max : Vector2;
var obj_grid : GameObject;
var obj_floor : GameObject;
var obj_ceiling : GameObject;
var obj_wall : GameObject;
var obj_door : GameObject;
var obj_pot_room : GameObject;
var obj_room : GameObject;
var room_objects : GameObject[];
var door_links : GameObject[,];
var obj_player : GameObject;
function Start () {
dungeon_size.x = room_size_max.x * remaining_rooms;
dungeon_size.y = room_size_max.y * remaining_rooms;
//var inst_grid = Instantiate(obj_grid,Vector3(dungeon_size.x/2,dungeon_size.y/2,10),Quaternion.identity);
//inst_grid.transform.localScale.x = dungeon_size[0];
//inst_grid.transform.localScale.y = dungeon_size[1];
dungeon_grid = new int[dungeon_size.x,dungeon_size.y];
room_grid = new int[dungeon_size.x,dungeon_size.y];
var start_location = Vector3(Mathf.Round(Random.Range(1,dungeon_size.x-2)),Mathf.Round(Random.Range(1,dungeon_size.y-2)),-1);
GenerateRoom(start_location,remaining_rooms-1);
start_location.z = start_location.y;
start_location.y = 0.5;
obj_player.transform.position = start_location;
BuildLevel();
}

function GenerateRoom(start_pos : Vector3 ,num_rooms : int) : boolean{
	var orig = Vector2(Mathf.Round(start_pos.x),Mathf.Round(start_pos.y));
	//print(orig);
	var fin_all = false;
	var fin_left = false;
	var fin_up = false;
	var fin_right = false;
	var fin_down = false;
	
	var lim_left = 0;
	var lim_up = 0;
	var lim_right = 0;
	var lim_down = 0;
	var room_width : int = Random.Range(room_size_min.x,room_size_max.x);
	var room_height : int = Random.Range(room_size_min.y,room_size_max.y);
	var room_entrances : Vector3[];
	
	var viable_rooms : int;
	while(!fin_all) {
		//lim_left
		var check_x = orig.x-lim_left-1;
		//print(check_x);
		var stride_length = lim_down+1+lim_up;
		if(check_x == 0) {
			fin_left = true;
		}
		else for(var i = 0; i < stride_length; i++) {
			var check_y = orig.y-lim_down+i;
			if(dungeon_grid[check_x,check_y] != 0) fin_left = true;
		}
		if(!fin_left) lim_left++;
		if(lim_left+1+lim_right == room_width) {
			fin_left = true;
			fin_right = true;
		}
		//lim_up
		check_y = orig.y+lim_up+1;
		stride_length = lim_left+1+lim_right;
		if(check_y == dungeon_size.y-1) {
			fin_up = true;
		}
		else for(i = 0; i < stride_length; i++) {
			check_x = orig.x-lim_left+i;
			if(dungeon_grid[check_x,check_y] != 0) fin_up = true;
		}
		if(!fin_up) lim_up++;
		if(lim_down+1+lim_up == room_height) {
			fin_down = true;
			fin_up = true;
		}
		//lim_right
		check_x = orig.x+lim_right+1;
		//print(check_x);
		stride_length = lim_down+1+lim_up;
		if(check_x == dungeon_size.x-1) {
			fin_right = true;
		}
		else for(i = 0; i < stride_length; i++) {
			check_y = orig.y+lim_up-i;
			if(dungeon_grid[check_x,check_y] != 0) fin_right = true;
		}
		if(!fin_right) lim_right++;
		if(lim_left+1+lim_right == room_width) {
			fin_left = true;
			fin_right = true;
		}
		//lim_down
		check_y = orig.y-lim_down-1;
		//print(check_y);
		stride_length = lim_left+1+lim_right;
		if(check_y == 0) {
			fin_down = true;
		}
		else for(i = 0; i < stride_length; i++) {
			check_x = orig.x+lim_right-i;
			if(dungeon_grid[check_x,check_y] != 0) fin_down = true;
		}
		if(!fin_down) lim_down++;
		if(lim_down+1+lim_up == room_height) {
			fin_down = true;
			fin_up = true;
		}
	if(fin_left && fin_up && fin_right && fin_down) fin_all = true;
	//yield;
	}
	//print((orig.x-lim_left) +", " + (orig.y+lim_up) + ", " + (orig.x+lim_right) + ", " + (orig.y-lim_down));

	if((lim_left+lim_right+1) >= room_size_min.x && (lim_down+lim_up+1) >= room_size_min.y) {
	switch(start_pos.z) {
			case 0:
				dungeon_grid[orig.x+1,orig.y] = 3;
				//var door = Instantiate(obj_door,Vector2(orig.x+1,orig.y),Quaternion.identity);
				//door.transform.name = "door " + generated_rooms.ToString();
				break;
			case 1:
				dungeon_grid[orig.x,orig.y-1] = 3;
				//door = Instantiate(obj_door,Vector2(orig.x,orig.y-1),Quaternion.identity);
				//door.transform.name = "door " + generated_rooms.ToString();
				break;
			case 2:
				dungeon_grid[orig.x-1,orig.y] = 3;
				//door = Instantiate(obj_door,Vector2(orig.x-1,orig.y),Quaternion.identity);
				//door.transform.name = "door " + generated_rooms.ToString();
				break;
			case 3:
				dungeon_grid[orig.x,orig.y+1] = 3;
				//door = Instantiate(obj_door,Vector2(orig.x,orig.y+1),Quaternion.identity);
				//door.transform.name = "door " + generated_rooms.ToString();
				break;
			}
		room_width = lim_left+lim_right+1;
		room_height = lim_down+lim_up+1;
		room_entrances = new Vector3[room_width*2+room_height*2];
		for(i = 0; i < room_width; i++) {
			for(var j = 0; j < room_height; j++) {
				check_x = orig.x-lim_left+i;
				check_y = orig.y-lim_down+j;
				if(i >= 0 && i <= room_width-1 && j >= 0 && j <= room_height-1)
					dungeon_grid[check_x,check_y] = 1;
					room_grid[check_x,check_y] = generated_rooms;
					//Instantiate(obj_floor,Vector3(check_x,check_y,0),Quaternion.identity);
				if(i == 0) {
					if(dungeon_grid[check_x-1,check_y] == 0) {
						dungeon_grid[check_x-1,check_y] = 2;
						//room_grid[check_x-1,check_y] = generated_rooms;
						//Instantiate(obj_wall,Vector3(check_x-1,check_y,0),Quaternion.identity);
					}
					if(check_x-2 > 0 && dungeon_grid[check_x-2,check_y] == 0) {
						//Instantiate(obj_pot_room,Vector3(check_x-2,check_y,0),Quaternion.identity);
						room_entrances[viable_rooms] = Vector3(check_x-2,check_y,0);
						viable_rooms++;
					}
				}
				if(i == room_width-1) {
					if(dungeon_grid[check_x+1,check_y] == 0) {
						dungeon_grid[check_x+1,check_y] = 2;
						//room_grid[check_x+1,check_y] = generated_rooms;
						//Instantiate(obj_wall,Vector3(check_x+1,check_y,0),Quaternion.identity);
					}
					if(check_x+2 < dungeon_size.x-1 && dungeon_grid[check_x+2,check_y] == 0) {
						//Instantiate(obj_pot_room,Vector3(check_x+2,check_y,0),Quaternion.identity);
						room_entrances[viable_rooms] = Vector3(check_x+2,check_y,2);
						viable_rooms++;
					}
				}
				if(j == 0) {
					if(dungeon_grid[check_x,check_y-1] == 0) {
						dungeon_grid[check_x,check_y-1] = 2;
						//room_grid[check_x,check_y-1] = generated_rooms;
						//Instantiate(obj_wall,Vector3(check_x,check_y-1,0),Quaternion.identity);
					}
					if(check_y-2 > 0 && dungeon_grid[check_x,check_y-2] == 0) {
						//Instantiate(obj_pot_room,Vector3(check_x,check_y-2,0),Quaternion.identity);
						room_entrances[viable_rooms] = Vector3(check_x,check_y-2,3);
						viable_rooms++;
					}
				}
				if(j == room_height-1) {
					if(dungeon_grid[check_x,check_y+1] == 0) {
						dungeon_grid[check_x,check_y+1] = 2;
						//room_grid[check_x,check_y+1] = generated_rooms;
						//Instantiate(obj_wall,Vector3(check_x,check_y+1,0),Quaternion.identity);
					}
					if(check_y+2 < dungeon_size.y-1 && dungeon_grid[check_x,check_y+2] == 0) {
						//Instantiate(obj_pot_room,Vector3(check_x,check_y+2,0),Quaternion.identity);
						room_entrances[viable_rooms] = Vector3(check_x,check_y+2,1);
						viable_rooms++;
					}
				}	
			}
		}
		for(i = 0; i < viable_rooms; i++){
			var temp : Vector3 = room_entrances[i];
			var random_select : int = Random.Range(0,viable_rooms);
			room_entrances[i] = room_entrances[random_select];
			room_entrances[random_select] = temp;
		}
		generated_rooms++;
		var room_attempts : int = 0;
		var room_number = generated_rooms+1;
		while(num_rooms > 0 && room_attempts < viable_rooms) {
			//print(room_entrances[room_attempts]);
			var split_rooms : int = Random.Range(1,num_rooms);
			if(dungeon_grid[room_entrances[room_attempts].x,room_entrances[room_attempts].y] == 0) {
				if(GenerateRoom(room_entrances[room_attempts],(split_rooms-1)))
					num_rooms += -split_rooms;
				}
			room_attempts++;
		}
		
	} else return false;
	return true;
}

//////////////
//////////////
//////////////
//////////////
//////////////
//////////////
//////////////

function BuildLevel() {
	room_objects = new GameObject[remaining_rooms];
	door_links = new GameObject[remaining_rooms-1,3];
	var door_counter = 0;
	for(var i = 0; i < remaining_rooms; i++){
		room_objects[i] = Instantiate(obj_room,Vector3.zero,Quaternion.identity);
		room_objects[i].transform.name = "Room " + i;
	}
	for(i = 0; i < dungeon_size.x; i++) {
		for(var j = 0; j < dungeon_size.y; j++) {
			switch(dungeon_grid[i,j]) {
				case 1:
					var dungeon_item = Instantiate(obj_floor,Vector3(i,0,j),Quaternion.identity);					
					dungeon_item.transform.Rotate(Vector3(90,0,0));
					dungeon_item = Instantiate(obj_ceiling,Vector3(i,2,j),Quaternion.identity);					
					dungeon_item.transform.Rotate(Vector3(-90,0,0));
					break;
				case 2:
					dungeon_item = Instantiate(obj_wall,Vector3(i,1,j),Quaternion.identity);
					//dungeon_item.transform.Rotate(Vector3(0,0,180));
					break;
				case 3:
					dungeon_item = Instantiate(obj_door,Vector3(i,1,j),Quaternion.identity);
					//link this badboy to their rooms
					door_links[door_counter,0] = dungeon_item;
					if(dungeon_grid[i+1,j] == 1) {
						dungeon_item.transform.Rotate(0,90,0);
						door_links[door_counter,1] = room_objects[room_grid[i+1,j]];
						door_links[door_counter,2] = room_objects[room_grid[i-1,j]];
					}
					else {
						door_links[door_counter,1] = room_objects[room_grid[i,j-1]];
						door_links[door_counter,2] = room_objects[room_grid[i,j+1]];
					}	
					break;	
			}
			if(dungeon_item){
				if(dungeon_grid[i,j]==1)
					dungeon_item.transform.parent=room_objects[room_grid[i,j]].transform;
					
			}
		}
	}
}
