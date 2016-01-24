#pragma strict
var dungeon_size : int[]; //size of the dungeon_grid array, 0 = x, 1 = y
var dungeon_grid : int[,]; //all the info for each cell, 0 = empty, 1 = floor, 2 = wall, 3 = door
var remaining_rooms : int; //how many rooms are left through the iterations
var unresolved_rooms : int; //rooms that are remaining after one room fails to be created.  Thrown to the next room successfully created
var room_width_range : int[]; //0 = min, 1 = max
var room_height_range : int[]; //0 = min, 1 = max
function Start () {
dungeon_size = new int[2];
dungeon_size[0] = room_width_range[1]*remaining_rooms;
dungeon_size[1] = room_height_range[1]*remaining_rooms;
dungeon_grid = new int[dungeon_size[0],dungeon_size[1]];
var start_pos : Vector3 = Vector3(Random.Range(1,dungeon_size[0]-2),Random.Range(1,dungeon_size[1]-2),-1);
GenerateLevel(start_pos,remaining_rooms);
}

function Update () {
if(Input.GetKeyUp(KeyCode.Space)) Application.LoadLevel(Application.loadedLevel);

}


function GenerateLevel(start_pos : Vector3 /*(x,y,dir)*/, num_rooms : int) { //dir -1 = no direction
//first we check the surrounding cells, grow, and continue until all sides are constrained
//or the room requirements are met
var room_width = Random.Range(room_width_range[0],room_width_range[1]);
var room_height = Random.Range(room_width_range[0],room_width_range[1]);
var origin : Vector2 = Vector2(start_pos.x,start_pos.y);
var doorway : Vector2 = origin;
switch(start_pos.z) {
    case 0: doorway.x--;
    case 1: doorway.y++;
    case 2: doorway.x++;
    case 3: doorway.y--;
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
do {
    //check left from bottom to top
    if(!fin_left){
        check_length = lim_up+lim_down+1;
        check_pos.x = origin.x-lim_left;
        for(var i : int = 0; i < check_length; i++) {
            check_pos.y = origin.y-lim_down+i;
            if(check_pos.x == 1) fin_left = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_left = true;            
        }
        if(!fin_left) lim_left++;
        if(lim_left+lim_right+1 == room_width) {
            fin_left = true;
            fin_right = true;
        }
    }
    
    if(!fin_up){
        check_length = lim_left+lim_right+1;
        check_pos.y = origin.y+lim_up;
        for(i = 0; i < check_length; i++) {
            check_pos.x = origin.x-lim_left+i;
            if(check_pos.y == dungeon_size[1]-2) fin_up = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_up = true;            
        }
        if(!fin_up) lim_up++;
        if(lim_down+lim_up+1 == room_height) {
            fin_down = true;
            fin_up = true;
        }
    }
        
    if(!fin_right){
        check_length = lim_up+lim_down+1;
        check_pos.x = origin.x+lim_right;
        for(i = 0; i < check_length; i++) {
            check_pos.y = origin.y+lim_up-i;
            if(check_pos.x == dungeon_size[0]-2) fin_right = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_right = true;            
        }
        if(!fin_right) lim_right++;
        if(lim_left+lim_right+1 == room_width) {
            fin_left = true;
            fin_right = true;
        }
    }
    
    if(!fin_down){
        check_length = lim_left+lim_right+1;
        check_pos.y = origin.y-lim_down;
        for(i = 0; i < check_length; i++) {
            check_pos.x = origin.x+lim_right-i;
            if(check_pos.y == 1) fin_down = true;
            else if(dungeon_grid[check_pos.x,check_pos.y] != 0) fin_down = true;            
        }
        if(!fin_down) lim_down++;
        if(lim_down+lim_up+1 == room_height) {
            fin_down = true;
            fin_up = true;
        }
    } 
fin_all = (fin_left && fin_up && fin_right && fin_down) ? true : false;
} while (!fin_all);
print("DONE");
//then we determine if it was constrained, is it still big enough?
if((lim_left+1+lim_right) >= room_width*0.5 && (lim_up+1+lim_down) >= room_height*0.5){
//then we assign values to the grid.  1 = floor, 2 = wall, 3 = door
    
}




    
}