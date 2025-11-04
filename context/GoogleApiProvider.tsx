import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const GOOGLE_API_KEY = process.env.API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

type GoogleApiContextType = {
  gapi: any;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  profile: any;
};

const GoogleApiContext = createContext<GoogleApiContextType | null>(null);

export const GoogleApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [gapi, setGapi] = useState<any>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [profile, setProfile] = useState(null);

    const updateSigninStatus = useCallback((signedIn: boolean) => {
        setIsSignedIn(signedIn);
        if (signedIn) {
             const authInstance = (window as any).gapi.auth2.getAuthInstance();
             if (authInstance) {
                const currentUser = authInstance.currentUser.get();
                setProfile(currentUser.getBasicProfile());
             }
        } else {
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const gapi = (window as any).gapi;
            gapi.load('client:auth2', () => {
                if (!GOOGLE_CLIENT_ID) {
                    console.warn("GOOGLE_CLIENT_ID not found. Google Calendar integration is disabled.");
                    gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    }).then(() => {
                        setGapi(gapi);
                    }).catch((error: any) => {
                        console.error("Error initializing Google API client without auth", JSON.stringify(error, null, 2));
                    });
                    return;
                }

                gapi.auth2.init({
                    clientId: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                }).then(() => {
                    return gapi.client.init({
                        apiKey: GOOGLE_API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                }).then(() => {
                    setGapi(gapi);
                    const authInstance = gapi.auth2.getAuthInstance();
                    if (authInstance) {
                        authInstance.isSignedIn.listen(updateSigninStatus);
                        updateSigninStatus(authInstance.isSignedIn.get());
                    } else {
                        console.error("Google Auth instance not found after initialization.");
                    }
                }).catch((error: any) => {
                     console.error("Error initializing Google API client", JSON.stringify(error, null, 2));
                });
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [updateSigninStatus]);
    
    const signIn = () => {
        if(gapi) gapi.auth2.getAuthInstance().signIn();
    };
    
    const signOut = () => {
        if(gapi) gapi.auth2.getAuthInstance().signOut();
    };

    const value = { gapi, isSignedIn, signIn, signOut, profile };

    return <GoogleApiContext.Provider value={value}>{children}</GoogleApiContext.Provider>;
};

export const useGoogleApi = () => {
    const context = useContext(GoogleApiContext);
    if (!context) {
        throw new Error("useGoogleApi must be used within a GoogleApiProvider");
    }
    return context;
};
