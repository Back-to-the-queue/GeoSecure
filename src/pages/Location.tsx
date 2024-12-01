import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { carSportOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import axios, { AxiosResponse, AxiosError } from 'axios';

let trajectoryData: number[][] = [];
// Saves tracker ID so it can be disabled when needed
let tracker: string | number | NodeJS.Timeout | undefined;

const Location: React.FC = () => {
    const API_BASE_URL = 'https://4fd6tgu6vf.execute-api.us-east-1.amazonaws.com/prod';
    // Stores location coordinates, as well as timestamp of recording
    const [location, setLocation] = useState<{latitude: number; longitude: number; timestamp: number} | null>(null);
    // Holds error strings for display when errors occur
    const [locationError, setLocationError] = useState<string | null>(null);
    // For toggling tracking status
    const [isTracking, setTracking] = useState(false);
    
    /**
     * Activates when the user presses the tracking button.
     * Toggles tracking to be on or off.
     */
    const toggleTracking = () => {
        checkPermissions();
        // Begin tracking if permissions granted and not tracking
        if (locationError == null && !isTracking)
        {
            // Immediately get starting location
            updateUserLocation();

            // Set automatic tracking
            tracker = setInterval(updateUserLocation, 5000);

            setTracking(true);
            console.log("Began tracking location. Tracking ID=" + tracker);
            document.getElementById('track-toggle')!.textContent = "Stop Tracking";
            document.getElementById('track-status')!.textContent = "Location tracking enabled.";
            document.getElementById('location-display')!.style.display = "initial";
        }
        else { // Stop tracking if already tracking, or permissions not granted
            clearInterval(tracker);
            setTracking(false);
            trajectoryData = []; // Clear stored data
            console.log("Stopped tracking location. Tracking ID=" + tracker);
            document.getElementById('track-toggle')!.textContent = "Start Tracking";
            document.getElementById('track-status')!.textContent = "Location tracking disabled.";
            document.getElementById('location-display')!.style.display = "none";
        }
    }

    /**
     * Updates user location with current coordinates and timestamp.
     * Prints an error if location permissions are denied.
     */
    const updateUserLocation = async () => {
        try {
            const position = await Geolocation.getCurrentPosition();
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: position.timestamp
            });
            recordUserLocation(position);
            setLocationError(null); // Reset error if successful
        } catch (error) {
            console.error('Error getting location', error);
            setLocationError('Unable to retrieve location.'); // Set error message
        }
    };

    /**
     * Takes positional data and stores it as an entry for a trajectory.
     * Creates a trajectory after a fixed number of entires are stored
     * and calls the encryption algorithm.
     * @param position The current position of the user
     */
    const recordUserLocation = (position: Position) => {
        const entry = [position.coords.latitude,
            position.coords.longitude,
            position.timestamp];
        trajectoryData.push(entry);
        console.log("Recorded user location: " + entry);
        if (trajectoryData.length >= 10) // Change this to 100 in final product
        {
            encryptTrajectory(trajectoryData);
        }
    }

    /**
     * Encrypts a trajectory by multiplying it and calculating the
     * differences between data points.
     * @param trajectoryData The trajectory to be encrypted
     */
    const encryptTrajectory = (trajectoryData:number[][]) => {
        // Multiply the data points to remove the decimal places
        trajectoryData.forEach((entry, i) => {
            // Take one data point and multiply it
            entry.forEach((stat, i) => {
                stat = stat * 10000;
                entry[i] = stat;
            });
            trajectoryData[i] = entry;
        });
        console.log("Multiplied user location: " + trajectoryData);

        // Subtract each point by its previous
        for (let entry = trajectoryData.length-1; entry > 0; entry--)
        {
            // Calculate the difference between a point and the previous point
            const newEntry = trajectoryData[entry].map((stat, i) => {
                return stat - trajectoryData[entry-1][i];
            });
            // Overwrite the point
            trajectoryData[entry] = newEntry;
        }

        // Store the first point as a key
        const key = trajectoryData[0];
        // Store encrypted data separately
        const encryptedTrajectory = trajectoryData.slice(1);

        console.log("Trajectory key: " + key);
        console.log("Encrypted Trajectory: " + encryptedTrajectory);
        
        // Upload trajectory
        uploadTrajectory(key, trajectoryData[0][2], encryptedTrajectory);
    }

    // Uploads the trajectory to the database
    const uploadTrajectory = async(key: number[], tripId: number, locationData: number[][]) => {

        const {value} = await Preferences.get({key: "userId"});
        const userId = value;
        console.log(userId);

        axios.post(`${API_BASE_URL}/startTracking`, { userId, tripId, locationData});

        // Clear trajectory after it is uploaded
        trajectoryData = [];
    }

    // Check permissions
    const checkPermissions = async () => {
        if (Capacitor.getPlatform() === 'web') {
            // For web, use the browser's Geolocation API
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocationError(null);
                    },
                    (error) => {
                        setLocationError('Location access denied.'); // Handle error
                    }
                );
            } else {
                setLocationError('Geolocation is not supported by this browser.');
            }
        } else {
            // For mobile platforms, check permissions
            const permissions = await Geolocation.checkPermissions();
            if (permissions.location !== 'granted') {
                const requestResult = await Geolocation.requestPermissions();
                if (requestResult.location === 'granted') {
                    setLocationError(null);
                }
                else {
                    setLocationError('Location access denied.');
                }
            } 
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" fullscreen>
                <div style={{ textAlign: 'center'}}>
                    {/* all content on main page */}
                    {/* icon of a sports car to use as a sort of logo */}
                    <IonIcon icon={carSportOutline} color= "primary" style={{ fontSize: '200px' }} />

                    <IonButton id='track-toggle' expand="full" onClick={toggleTracking} className="ion-margin-top">
                        Start Tracking
                    </IonButton>
                    
                    <h2 id='track-status'></h2>
                    {locationError ? (
                        <h1>{locationError}</h1>
                    ) : location ? (
                        <div id='location-display'>
                            {/* Display location */}
                            <h2>Your Location:</h2>
                            <p>Latitude: {location.latitude}</p>
                            <p>Longitude: {location.longitude}</p>
                        </div>
                    ) : (
                        <h1>Track Your Location!</h1>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Location;