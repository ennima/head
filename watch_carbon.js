var os = require('os');
const path_p = require('path');
var chokidar = require('chokidar');
var S = require('string');
var fs = require('fs');


var path_w = "/home/gvadmin/dev/catcher";
var path_trash = "/home/gvadmin/dev/trash/";
var path_log = ".";
counter = 0;
var extensiones_arr = [".mov",".mxf",".avi",".mp4",".mpg",".wav",".gxf",".ogg"];



var data = fs.readFileSync('./conf.json'),myObj;

try {
    myObj = JSON.parse(data);
    // console.dir(myObj);
    // console.log(myObj.path_w);
    path_w = myObj.path_w;
    path_trash = myObj.path_trash;
    path_log = myObj.path_log;
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }


function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
} 



var watcher = chokidar.watch(path_w, {
  ignored: /[\/\\]\./, 
  persistent: true,
  followSymlinks: false
  // usePolling: true,
  // depth: undefined,
  // interval: 100,
  // ignorePermissionErrors: false
});

var log = console.log.bind(console);

function checkFileCopyComplete(path, prev, stats) {
  console.log("path: "+path);
  console.log(" prev: "+prev);
  
   fs.stat(path, function (err, stat) {
    // console.log(stat);
    if (stat.mtime.getTime() === prev.mtime.getTime()) {
      console.log("COOOOOOOOL");
      

      if (extensiones_arr.indexOf(path_p.extname(path)) > -1) 
      {

      } else {
          //Not in the array
          console.log("Archivo "+path_p.extname(path)+" no compatible.");
          run_cmd("mv",[path,path_trash+path_p.basename(path)],function(text) { console.log (text) });
          console.log("log path: ", path_log);
      }

    }else{
      console.log("Falta");
      setTimeout(checkFileCopyComplete, 1000, path, stat);
    }
   });
}
watcher
  .on('add', function(path, stats) { 
    log('File', path, 'Has been added');
    if (stats) {
        console.log('ADD File', path, 'changed size to', stats.size); 
        setTimeout(checkFileCopyComplete,1000, path, stats);


    }



  })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
//  .on('change', function(path) { log('File', path, 'has been changed'); })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
//  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function(path, stats) {
  console.log("MAMON")
  if (stats) console.log('File', path, 'changed size to', stats.size);

});

// Watch new files.
//watcher.add('new-file');
//watcher.add(['new-file-2', 'new-file-3', '**/other-file*']);

// Un-watch some files.
//watcher.unwatch('new-file*');

// Only needed if watching is `persistent: true`.
//watcher.close();


/*require('chokidar').watch(path_w, {ignored: /[\/\\]\./}).on('all', function(event, path) {
   console.log(event, path);

  

   counter += 1;
   console.log("CONTADOR: "+counter);

  if(event == "change"){

    if (stats) console.log('File', path, 'changed size to', stats.size);

    console.log(" Se alteró: "+path);
    console.log(path_p.basename(path) + "Ext: "+path_p.extname(path));
    // run_cmd("whoami",[],function(text) { console.log (text) });
    console.log(path_p.basename(path) + "Ext: "+path_p.extname(path));
    if (extensiones_arr.indexOf(path_p.extname(path)) > -1) {
        //In the array!
        //console.log("Convierte");
        //run_cmd("python",["transcode_service.py",path],function(text) { console.log (text) });
    } else {
        //Not in the array
        console.log("Archivo "+path_p.extname(path)+" no compatible.");
    }
  }
  if(event == "add"){
    console.log(" Se Añadió: "+path);

    console.log(path_p.basename(path) + "Ext: "+path_p.extname(path));
    if (extensiones_arr.indexOf(path_p.extname(path)) > -1) {
        //In the array!
        console.log("Convierte");
        run_cmd("python",["transcode_service.py",path],function(text) { console.log (text) });
    } else {
        //Not in the array
        console.log("Archivo "+path_p.extname(path)+" no compatible.");
    }
    
  }
});*/
