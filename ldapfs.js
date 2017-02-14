var fs = require('fs');
var filelist =[];

function init(){
  /*
fs.readFile('./passwd.txt','utf8',function(err,text){
  console.log('file read');
  console.log(text);
  filelist =text.replace(/\r/g, "").split("\n");
  console.log(filelist[0]);
  console.log('error');
  console.log(err);
  });
  */
text = fs.readFileSync('./passwd.txt',{ encoding:"utf8"});
list =text.replace(/\r/g, "").split("\n");
for (var i=0; i<list.length-1; i++){
  entry= list[i].replace(/\r/g, "").split(":");
	console.log('name : '+entry[0]);
  filelist.push({
     name: entry[0],
     userpassword: entry[1],
     test:'test'
   });
 }
}

function getlist(){
  init();
  return filelist;
}

module.exports.init = init;
module.exports.getlist = getlist;
