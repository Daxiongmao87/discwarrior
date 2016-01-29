#pragma strict
var dungeon_size : int[]; //size of the dungeon_grid array, 0 = x, 1 = y
var dungeon_grid : int[,]; //all the info for each cell, 0 = empty, 1 = floor, 2 = wall, 3 = door
var remaining_rooms : int; //how many rooms are left through the iterations
var unresolved_rooms : int; //rooms that are remaining after one room fails to be created.  Thrown to the next room successfully created
var room_width_range : int[]; //0 = min, 1 = max
var room_height_range : int[]; //0 = min, 1 = max

var obj_grid : GameObject;
var obj_floor : GameObject;
var obj_wall : GameObject;
var obj_door : GameObject;
var obj_pot_room : GameObject;
function Start () {
dungeon_size = new int[2];
dungeon_size[0] = room_width_range[1]*remaining_rooms;
dungeon_size[1] = room_height_range[1]*remaining_rooms;
dungeon_grid = new int[dungeon_size[0],dungeon_size[1]];
var inst_grid = Instantiate(obj_grid,Vector3(dungeon_size[0]/2,dungeon_size[1]/2,10),Quaternion.identity);
inst_grid.transform.localScale.x = dungeon_size[0];
inst_grid.transform.localScale.y = dungeon_size[1];
var start_pos : Vector3 = Vector3(Random.Range(1,dungeon_size[0]-2),Random.Range(1,dungeon_size[1]-2),-1);
GenerateRoom(start_pos,remaining_rooms);
}

function Update () {
if(Input.GetKeyUp(KeyCode.Space)) Application.LoadLevel(Application.loadedLevel);

}


function GenerateRoom(start_pos : Vector3 /*(x,y,dir)*/, num_rooms : int) : boolean { //dir -1 = no direction
//first we check the surrounding cells, grow, and continue until all sides are constrained
//or the room requirements are met
//print(start_pos);
var room_width = Random.Range(room_width_range[0],room_width_range[1]);
var room_height = Random.Range(room_width_range[0],room_width_range[1]);
var origin : Vector2 = Vector2(start_pos.x,start_pos.y);
var doorway : Vector2 = origin;
switch(start_pos.z) {
    case 0: doorway.x++;
    case 1: doorway.y--;
    case 2: doorway.x--;
    case 3: doorway.y++;
}
var lim_left : int = 0;
var lim_up : int = 0;
var lim_right : int = 0;
var lim_down : int = 0;
var fin_left : boolean = false;
var fin_up : boolean = false;
var fin_right : boolean = false;
var fin_down : boolean = false;
var fin_all : boolean = false;
var check_pos : Vector2;
var check_length : int;
var check_width : int;
var num_pot_rooms : int = 0;
var next_rooms : Vector3[];
do {
    //check left from bottom to top
	print(start_pos);
    if(!fin_left){
		
        check_length = lim_up+lim_down+1;
        check_pos.x = origin.x-lim_left;
        if(lim_left+lim_right+1 == room_width) {
            fin_left = true;
            fin_right = true;
        }
        for(var i : int = 0; i < check_length; i++) {
            check_pos.y = origin.y-lim_down+i;
            if(check_pos.x == 1) fin_left = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_left = true;            
        }
        if(!fin_left) lim_left++;

    }
    
    if(!fin_up){
        check_length = lim_left+lim_right+1;
        check_pos.y = origin.y+lim_up;
        //print(check_pos.y);
        if(lim_down+lim_up+1 == room_height) {
            fin_down = true;
            fin_up = true;
        }
        for(i = 0; i < check_length; i++) {
            check_pos.x = origin.x-lim_left+i;
            if(check_pos.y == dungeon_size[1]-2) fin_up = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_up = true;            
        }
        if(!fin_up) lim_up++;

    }
        
    if(!fin_right){
        check_length = lim_up+lim_down+1;
        check_pos.x = origin.x+lim_right;
        if(lim_left+lim_right+1 == room_width) {
            fin_left = true;
            fin_right = true;
        }
        for(i = 0; i < check_length; i++) {
            check_pos.y = origin.y+lim_up-i;
            if(check_pos.x == dungeon_size[0]-2) fin_right = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_right = true;            
        }
        if(!fin_right) lim_right++;
    }
    
    if(!fin_down){
        check_length = lim_left+lim_right+1;
        check_pos.y = origin.y-lim_down;
        if(lim_down+lim_up+1 == room_height) {
            fin_down = true;
            fin_up = true;
        }
        for(i = 0; i < check_length; i++) {
            check_pos.x = origin.x+lim_right-i;
            if(check_pos.y == 1) fin_down = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_down = true;            
        }
        if(!fin_down) lim_down++;

    } 
if(start_pos.z != -1) print("("+start_pos.x+", " + start_pos.y + ",dir= " + start_pos.z + ")\n" +fin_left + ", " + fin_up + ", " + fin_right + ", " + fin_down +"\n" + lim_left + ", " + lim_up + ", " + lim_right + ", " + lim_down);
fin_all = (fin_left && fin_up && fin_right && fin_down) ? true : false;
} while (!fin_all);
//then we determine if it was constrained, is it still big enough?
if((lim_left+1+lim_right) >= room_width*0.5 && (lim_up+1+lim_down) >= room_height*0.5){
//then we assign values to the grid.  1 = floor, 2 = wall, 3 = door
	remaining_rooms--;
	print("SUCCESS");
	num_rooms--;
    room_width = lim_left+1+lim_right;
    room_height = lim_up+1+lim_down;
    for(i = -1; i < room_width+1; i++) {
        for(var j : int = -1; j < room_height+1; j++) {
            var check_x : int = origin.x-lim_left+i;
            var check_y : int = origin.y-lim_down+j;
                if(i == -1 || i == room_width || j == -1 || j == room_height) {
				//	print(check_x + ", " + check_y);
                    if(check_x == doorway.x && check_y == doorway.y) dungeon_grid[check_x,check_y] = 3;
                    else if(dungeon_grid[check_x,check_y] == 0) dungeon_grid[check_x,check_y] = 2; 
                }
                else dungeon_grid[check_x,check_y] = 1;
            switch(dungeon_grid[check_x,check_y]) {
                case 1:
                    Instantiate(obj_floor,Vector3(check_x,check_y,0),Quaternion.identity);
                    break;
                case 2: 
                    Instantiate(obj_wall,Vector3(check_x,check_y,0),Quaternion.identity);
                    break;
                case 3:  
                    Instantiate(obj_door,Vector3(check_x,check_y,0),Quaternion.identity);
                    break;                    
            }
            //NOW WE GOTTA COUNT THE PLACES TO CONSIDER FOR EXPANDING!!
            if(num_rooms > 0 && (((i == -1 || i == room_width) && (j > -1 && j < room_height)) || ((j == -1 || j == room_height) && (i > -1 && i < room_width)))) {
                switch(i) {
                    case -1:
						if(check_x > 1) {
							if(dungeon_grid[check_x-1,check_y] == 0) {
								num_pot_rooms++;	
							}
						}
						break;
                    case room_width:
						if(check_x < dungeon_size[0]-1) {
							if(dungeon_grid[check_x+1,check_y] == 0) {
								num_pot_rooms++;
								
							}
						}
						break;
                    }
                switch(j) {
                    case -1:
						if(check_y > 1) {
							if(dungeon_grid[check_x,check_y-1] == 0) {
								num_pot_rooms++;
							}
						}
						break;
                    case room_height:
						if(check_y < dungeon_size[1]-1) {
							if(dungeon_grid[check_x,check_y+1] == 0) {
								num_pot_rooms++;
								
							}
						}
						break;
                    }
                }
            }
        }
    //print("om nom: " + num_pot_rooms + ", " + ((room_width)*2+(room_height)*2));
    next_rooms = new Vector3[num_pot_rooms];
    var door_count : int = 0;
	for(i = -1; i < room_width+1; i++) {
		for(j = -1; j < room_height+1; j++) {
            check_x = origin.x-lim_left+i;
            check_y = origin.y-lim_down+j;
			if(num_rooms > 0 && (((i == -1 || i == room_width) && (j > -1 && j < room_height)) || ((j == -1 || j == room_height) && (i > -1 && i < room_width)))) {
				//print(i + ", " + j);
				switch(i) {
					case -1:
						if(check_x > 1) {
							if(dungeon_grid[check_x-1,check_y] == 0) {
								next_rooms[door_count] = Vector3(check_x-1,check_y,0) ;
								Instantiate(obj_pot_room,next_rooms[door_count],Quaternion.identity);
								door_count++;
							}
						}
						break;
					case room_width:
						if(check_x < dungeon_size[0]-2) {
							if(dungeon_grid[check_x+1,check_y] == 0) {
								next_rooms[door_count] = Vector3(check_x+1,check_y,2) ;
								Instantiate(obj_pot_room,next_rooms[door_count],Quaternion.identity);
								door_count++;
								
							}
						}
					}
				switch(j) {
					case -1:
						if(check_y > 1) {
							if(dungeon_grid[check_x,check_y-1] == 0) {
								next_rooms[door_count] = Vector3(check_x,check_y-1,3) ;
								Instantiate(obj_pot_room,next_rooms[door_count],Quaternion.identity);
								door_count++;
								
							}
						}
						break;
					case room_height:
						if(check_y < dungeon_size[1]-2) {
							if(dungeon_grid[check_x,check_y+1] == 0) {
								next_rooms[door_count] = Vector3(check_x,check_y+1,1) ;
								Instantiate(obj_pot_room,next_rooms[door_count],Quaternion.identity);
								door_count++;
								
							}
						}
					}
				}
			}
		}
	//print(door_count);
	//GREAT! We now have mapped all the potential rooms.  Lets shuffle the array for randomness,
	//then split the amount of remaining rooms to dedicate to this next path
		for(i = 0; i < num_pot_rooms; i++) {
			
			var random_switch = Random.Range(0,num_pot_rooms);
			var temp_index : Vector3 = next_rooms[i];
			next_rooms[i] = next_rooms[random_switch];
			next_rooms[random_switch] = temp_index;
			print(next_rooms[i]);
		}
		var attempt_count : int = 0;
		print(num_pot_rooms);
		while (num_rooms > 0 && attempt_count < num_pot_rooms){

			unresolved_rooms = 0;
			var passing_rooms : int = Random.Range(1,num_rooms);				
			num_rooms += -passing_rooms;
			Instantiate(obj_pot_room,Vector3(next_rooms[attempt_count].x,next_rooms[attempt_count].y,0),Quaternion.identity);
			if(!GenerateRoom(next_rooms[attempt_count],passing_rooms)) {
				print("failed");
				num_rooms+= unresolved_rooms;
				}
			attempt_count++;
		}
		if(num_rooms > 0) remaining_rooms+=num_rooms;
		print(num_rooms + " ... " + attempt_count +"/"+ num_pot_rooms + "... done?");
	} else {
		unresolved_rooms+=num_rooms;
		return false;
	}
	return true;
}
