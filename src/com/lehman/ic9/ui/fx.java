package com.lehman.ic9.ui;

import java.util.Map;

import com.lehman.ic9.ic9engine;

import javafx.application.Platform;
import javafx.stage.Modality;

public class fx {
    public static Object fxApp(ic9engine eng, Map<String, Object> tobj, String Title, int Width, int Height) {
        return fxApplication(eng, tobj, Title, Width, Height, false);
    }
    
    public static Object fxDialog(ic9engine eng, Map<String, Object> tobj, String Title, int Width, int Height) {
        return fxApplication(eng, tobj, Title, Width, Height, true);
    }
    
    private static Object fxApplication(final ic9engine eng, final Map<String, Object> tobj, final String title, final Integer width, final Integer height, final boolean modal) {
        final fxApplication app = fxApplication.getInstance();
        
        if(!Platform.isFxApplicationThread()) {
            Platform.runLater(new Runnable() {                          
                @Override
                public void run() {
                    App newStage = new App(eng, tobj, title, width, height);
                    newStage.setStyleSheets(app.getStyleSheets());
                    if(modal)
                        newStage.initModality(Modality.APPLICATION_MODAL);
                    tobj.put("native", newStage);
                }
            });
            
            // Wait for extern object to be set in UI thread.
            while(tobj.get("native") == null) { try { Thread.sleep(200); } catch (InterruptedException e) { e.printStackTrace(); } }
        } else {
            App newStage = new App(eng, tobj, title, width, height);
            newStage.setStyleSheets(app.getStyleSheets());
            if(modal)
                newStage.initModality(Modality.APPLICATION_MODAL);
            tobj.put("native", newStage);
        }
        
        return tobj;
    }
    
    public static void runLater(final ic9engine eng, final Object TheObj, final String FunctionName) {
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                try {
                    eng.invokeMethod(TheObj, FunctionName);
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    public static boolean isUiThread() {
        return Platform.isFxApplicationThread();
    }
}
