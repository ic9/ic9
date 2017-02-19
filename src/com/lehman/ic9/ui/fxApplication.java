package com.lehman.ic9.ui;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.stage.Stage;

public class fxApplication extends Application {
    // App instance.
    private static fxApplication instance = null;
    
    private static Stage stage = null;
    private static boolean initialized = false;
    
    public Stage getStage() { return stage; }
    public void setStage(Stage stg) { stage = stg; }
    
    public fxApplication() {
        Platform.setImplicitExit(false);
    }
    
    public boolean isInitialized() { return initialized; }
    
    public static boolean isInstantiated() {
        if(instance == null) return false;
        return true;
    }
    
    public static void stopInstance() {
        Platform.exit();
    }
    
    public static fxApplication getInstance() {
          if(instance == null) {
             instance = new fxApplication();
             instance.initApp();
          }
          return instance;
    }
    
    private class appLauncher extends Thread {
        private fxApplication app = null;
        
        public appLauncher(fxApplication TheApp) { this.app = TheApp; }
        public void run() {
            this.app.launchApp();
        }
    }
    
    public void initApp() {
        initialized = false;
        
        appLauncher al = new appLauncher(this);
        al.start();
        
        while(!initialized) {
            try {
                Thread.sleep(5);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }
    
    public void launchApp() {
        String[] args = new String[0];
        launch(args);
    }
    
    @Override
    public void start(Stage primaryStage) throws Exception {
        stage = primaryStage;
        initialized = true;
    }
}
