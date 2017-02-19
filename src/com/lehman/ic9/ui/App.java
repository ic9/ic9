package com.lehman.ic9.ui;

import java.io.File;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Map;

import javafx.application.Platform;
import javafx.event.EventHandler;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.MenuBar;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import javafx.stage.WindowEvent;

import javax.script.ScriptException;

import com.lehman.ic9.ic9engine;
import com.lehman.ic9.ic9exception;

public class App extends Stage {
    /*
     * Single FX app instance. (As required by JavaFX)
     */
    private Scene scene = null;
    
    private String title = "";
    private int width = 0;
    private int height = 0;
    
    private MenuBar mBar = null;
    private Parent layout = null;
    private boolean maximized = false;
    private boolean fullScreen = false;

    /* Block main execution thread */
    private boolean block = true;
    
    /* Object instance for event handlers and other settings. */
    private ic9engine eng = null;
    private Map<String, Object> jobj = null;
    
    /* Style sheet files */
    private ArrayList<String> styleSheets = new ArrayList<String>();
    private String style = null;
    private String id = null;
    
    public App(ic9engine Eng, Map<String, Object>Jobj, String title, Integer width, Integer height) {
        // Set engine and javascript object.
        this.eng = Eng;
        this.jobj = Jobj;
        
        this.title = title;
        if((width != null)&&(height != null))
            this.setBounds(width, height);
    }
    
    
    //public void setTitle(String Title) { this.title = Title; }
    public void setBounds(int Width, int Height) {
        this.width = Width;
        this.height = Height;
    }
    
    //public Scene getScene() { return this.scene; }
    //public void setScene(Scene theScene) { this.scene = theScene; }
    public Parent getLayout() { return this.layout; }
    public void setLayout(Parent Layout) { this.layout = Layout; }
    public ArrayList<String> getStyleSheets() { return this.styleSheets; }
    public void setStyleSheets(ArrayList<String> StyleSheets) { this.styleSheets = StyleSheets; }
    
    public void newFxApp(ic9engine Eng, Map<String, Object>Jobj, String Title, int Width, int Height) {
        // Set engine and javascript object.
        this.eng = Eng;
        this.jobj = Jobj;
        
        this.title = Title;
        this.width = Width;
        this.height = Height;
        
        fxApplication.getInstance().initApp();
        
        // Default layout
        FlowPane fp = new FlowPane();
        fp.setVgap(8);
        fp.setHgap(4);
        this.layout = fp;
    }
    
    public void show(boolean block) {
        this.block = block;
        
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                setTitle(title);
                setMaximized(maximized);
                
                if(jobj.containsKey("onShow")) registerOnShown();
                registerOnClosing();
                
                if(mBar != null) {
                    if((width != 0)&&(height != 0))
                        scene = new Scene(new VBox(), width, height);
                    else
                        scene = new Scene(new VBox());
                    ((VBox) scene.getRoot()).getChildren().addAll(mBar, layout);
                    VBox.setVgrow(layout, Priority.ALWAYS);
                    
                }
                else {
                    if(layout == null) layout = new HBox();
                    
                    if((width != 0)&&(height != 0))
                        scene = new Scene(layout, width, height);
                    else
                        scene = new Scene(layout);
                }
                
                for(String ss : styleSheets) {
                    scene.getStylesheets().add(ss);
                }
                if(style != null) { scene.getRoot().setStyle(style); }
                if(id != null) { scene.getRoot().setId(id); }
                
                setScene(scene);
                show();
            }
        });
        
        /* If blocking is set. */
        this.handleBlock();
    }
    
    public void _close() {
        this.close();
        fireEvent(new WindowEvent(this, WindowEvent.WINDOW_CLOSE_REQUEST));
    }
    
    private void handleBlock() {
        if(this.block) {
            while(this.block) { try { Thread.sleep(200); } catch (InterruptedException e) { e.printStackTrace(); } }
        }
    }
    
    public void _add(Object FxObj) throws ic9exception {
        if((FxObj != null)&&(FxObj instanceof Node)) {
            if(layout == null) layout = new HBox();
            
            if(this.layout instanceof Pane)
                ((Pane)this.layout).getChildren().add((Node)FxObj);
            else if(this.layout instanceof ScrollPane)
                ((ScrollPane)this.layout).setContent((Node)FxObj);
        }
        else
            throw new ic9exception("App.add(): Provided object is null or not an instance of javafx Node.");
    }
    
    public void _addStyleSheet(String SsFile) throws ic9exception
    {
        // If default stage not set, set it now.
        final fxApplication app = fxApplication.getInstance();
        app.setStage(this);
        
        final File f = new File(SsFile);
        try {
            this.styleSheets.add(f.toURI().toURL().toExternalForm());
        }
        catch (MalformedURLException e) {
            throw new ic9exception("App.addStyleSheet(): Malformed URL exception. " + e.getMessage());
        }
        
        
        if(this.scene != null) {
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    try {
                        scene.getStylesheets().add(f.toURI().toURL().toExternalForm());
                    } catch (MalformedURLException e) {
                        System.err.println("fxApp.addStyleSheet(): Malformed URL exception. " + e.getMessage());
                    }
                }
            });
        }
    }
    
    public void registerOnShown() {
        if(!this.jobj.containsKey("onShow")) this.setOnShown(null);
        else {
            setOnShown(new EventHandler<WindowEvent>() {
                @Override
                public void handle(WindowEvent event) {
                    if(jobj.containsKey("onShow")) {
                        try {
                            eng.invokeMethod(jobj, "onShow");
                        } catch (NoSuchMethodException | ScriptException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }
                    }
                }
            });
        }
    }
    
    public void registerOnClosing() {
        setOnCloseRequest(new EventHandler<WindowEvent>() {
            @Override
            public void handle(WindowEvent event) {
                if(jobj.containsKey("onClosing")) {
                    try {
                        eng.invokeMethod(jobj, "onClosing");
                    } catch (NoSuchMethodException | ScriptException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                block = false;
            }
        });
    }
    
    /*
     * OS Functions
     */
    public static void _openInBrowser(String Uri) {
        fxApplication inst = fxApplication.getInstance();
        inst.getHostServices().showDocument(Uri);
    }
    
    /* Getters */
    public boolean getMaximized() {
        return isMaximized();
    }
    
    public boolean getFullScreen() {
        return this.isFullScreen();
    }
    
    public String getStyleString() {
        if(this.scene != null) return this.scene.getRoot().getStyle();
        else if(this.style != null) return this.style;
        else return "";
    }
    
    /* Setters */
    public void _setLayout(Object LayoutObj) throws ic9exception {
        if((LayoutObj != null)&&(LayoutObj instanceof Node))
            this.layout = (Parent) LayoutObj;
        else
            throw new ic9exception("App.setLayout(): Provided object is null or not an instance of javafx Parent.");
    }
    
    public void _setMenuBar(Object MenuBarObj) throws ic9exception {
        if((MenuBarObj != null)&&(MenuBarObj instanceof MenuBar))
            this.mBar = (MenuBar)MenuBarObj;
        else
            throw new ic9exception("App.setMenuBar(): Provided object is null or not an instance of javafx MenuBar.");
    }
    
    public void _setMaximized(boolean Maximized) {
        this.maximized = Maximized;
        setMaximized(this.maximized);
    }

    public void _setFullScreen(boolean FullScreen) {
        this.fullScreen = FullScreen;
        
        Platform.runLater(new Runnable() {                          
            @Override
            public void run() {
                try {
                    setFullScreen(fullScreen);
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
