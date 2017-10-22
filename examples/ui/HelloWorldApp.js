include("ui/fx.js");

// Needs to be done prior to defining any other FX objects.
var mapp = fx.fxApp("Hello World", 1024, 768);

//Define button.
var Button = javafx.scene.control.Button;

// Instantiate a new button and add it to the application.
var button = new Button();
button.text = "Click Me!";
button.onAction = function() { console.log("Hello World!"); }
mapp.add(button);

// Startup the application. This is a blocking call.
mapp.startup();

// Once the app has exited we need to explicitly close the app thread.
mapp.close();