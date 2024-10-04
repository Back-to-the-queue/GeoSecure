import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const Profile: React.FC = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    //function to get the user's location
    const getUserLocation = async () => {
        try {
            const position = await Geolocation.getCurrentPosition();
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setLocationError(null); //reset error if successful
        } catch (error) {
            console.error('Error getting location', error);
            setLocationError('Unable to retrieve location.'); //set error message
        }
    };

    //check permissions and get the location when the component mounts
    useEffect(() => {
        const checkPermissions = async () => {
            if ( Capacitor.getPlatform() === 'web') {
                // For web, use the browser's Geolocation API
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                            setLocationError(null); // Reset error if successful
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
                    getUserLocation();
                } else {
                    // Request permissions
                    const requestResult = await Geolocation.requestPermissions();
                    if (requestResult.location === 'granted') {
                        getUserLocation();
                    } else {
                        setLocationError('Location access denied.');
                    }
                }
            }
        };
        checkPermissions();
    }, []);

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