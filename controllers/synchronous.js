
// OBSOLETE
// Hack for callback functions.
var sleep = require('sleep');

var sync_isDone = false;
var sync_prm1;
var sync_prm2;
var sync_prm3;
var sync_prm4;
var sync_prm5;

function sync_wait(){
	while(sync_isDone){
		sleep.sleep(1);
	}
	sync_isDone = false;
}

function sync_done(){
	sync_isDone = true;
}
