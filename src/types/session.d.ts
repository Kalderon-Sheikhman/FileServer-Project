import "express-session";

declare module 'express-session' {
    interface SessionData {
        sent_files: any;
        downloaded_files: any;
    }
}

  

  