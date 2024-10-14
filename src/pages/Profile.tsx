import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const Profile: React.FC = () => {
    const [location, setLocation] = useState<{latitude: number; longitude: number; timestamp: number} | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    let trajectoryData: number[][] = [];
    let tracker: string | number | NodeJS.Timeout | undefined;

    // Function to update the user's location
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

    // Records user latitude, longitude, and timestamp of recording
    const recordUserLocation = (position: Position) => {
        const entry = [position.coords.latitude,
            position.coords.longitude,
            position.timestamp];
        trajectoryData.push(entry);
        console.log("Recorded user location: " + entry);
        if (trajectoryData.length >= 10)
        {
            encryptTrajectory(trajectoryData);
        }
    }

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
        uploadTrajectory(key, encryptedTrajectory);
    }

    const uploadTrajectory = (key: number[], encryptedTrajectory: number[][]) => {
        // TODO: Upload trajectory data to database

        // Clear trajectory after it is uploaded
        trajectoryData = [];
    }

    // Check permissions and get the location when the component mounts
    useEffect(() => {
        const checkPermissions = async () => {
            if ( Capacitor.getPlatform() === 'web') {
                // For web, use the browser's Geolocation API
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            tracker = setInterval(updateUserLocation, 5000);
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
                if (permissions.location === 'granted') {
                    tracker = setInterval(updateUserLocation, 5000);
                } else {
                    // Request permissions
                    const requestResult = await Geolocation.requestPermissions();
                    if (requestResult.location === 'granted') {
                        tracker = setInterval(updateUserLocation, 5000);
                    } else {
                        setLocationError('Location access denied.');
                    }
                }
            }
        };
        checkPermissions();
    }, []);

    useIonViewDidLeave(() => {
        clearInterval(tracker);
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" fullscreen>
                <div style={{ textAlign: 'center'}}>
                {locationError ? (
                        <h1>{locationError}</h1>
                    ) : location ? (
                        <>
                            {/* Display location */}
                            <h2>Your Location:</h2>
                            <p>Latitude: {location.latitude}</p>
                            <p>Longitude: {location.longitude}</p>
                        </>
                    ) : (
                        <h1>Getting Location...</h1>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;