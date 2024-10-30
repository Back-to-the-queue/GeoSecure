import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, locationOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Location from './Location';

// new add part for speed test function ↓↓↓
import React, { useState, useRef, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { Plugins } from '@capacitor/core'; // For managing background tasks and wake locks
import './Home.css';

const { BackgroundTask } = Plugins;

// Haversine formula to calculate the distance between two lat/long points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
};

// Kalman filter class for GPS smoothing
class KalmanFilter {
  private R: number; // Process noise
  private Q: number; // Measurement noise
  private A: number; // State vector
  private B: number; // Control input matrix
  private C: number; // Measurement matrix
  private cov: number; // Covariance
  private x: number; // Estimated state

  constructor(R: number, Q: number) {
    this.R = R; // Process noise
    this.Q = Q; // Measurement noise
    this.A = 1; // No change to the state
    this.C = 1; // Directly measure the state
    this.B = 0; // No control input
    this.cov = NaN;
    this.x = NaN;
  }

  filter(z: number): number {
    if (isNaN(this.x)) {
      this.x = (1 / this.C) * z;
      this.cov = (1 / this.C) * this.Q * (1 / this.C);
    } else {
      this.cov = this.A * this.cov * this.A + this.R;
      const K = this.cov * this.C * (1 / (this.C * this.cov * this.C + this.Q));
      this.x = this.x + K * (z - this.C * this.x);
      this.cov = (1 - K * this.C) * this.cov;
    }
    return this.x;
  }
}

const kalmanFilterLat = new KalmanFilter(0.001, 0.1); // Kalman filter for latitude
const kalmanFilterLon = new KalmanFilter(0.001, 0.1); // Kalman filter for longitude

// Utility for speed calculation
const calculateSpeed = (lat1: number, lon1: number, time1: number, lat2: number, lon2: number, time2: number) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const timeDiffInSeconds = (time2 - time1) / 1000; // assuming time is in milliseconds
  const speedInMetersPerSecond = distance / timeDiffInSeconds;
  const speedInKmh = speedInMetersPerSecond * 3.6; // Convert speed to km/h
  return speedInKmh;
};

const Home: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0);
  const [tracking, setTracking] = useState<boolean>(false);
  const lastPosition = useRef<{ lat: number; lon: number; timestamp: number } | null>(null);
  const watchId = useRef<string | null>(null); // Ref to store the watch ID
  const GPS_CONNECTIVITY_THRESHOLD = 70; // Minimum percentage for stable GPS connectivity
  const wakeLock = useRef<any>(null); // To keep the device awake

  // Function to acquire a wake lock to prevent the device from sleeping
  const acquireWakeLock = async () => {
    try {
      await BackgroundTask.beforeExit(() => {
        console.log('Background task to prevent sleep initiated');
      });
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.error('Error acquiring wake lock:', err);
    }
  };

  // Function to release wake lock
  const releaseWakeLock = () => {
    if (wakeLock.current) {
      wakeLock.current.release();
      wakeLock.current = null;
    }
  };

  // Function to check GPS connectivity (simulate for now)
  const checkGPSConnectivity = () => {
    return Math.random() * 100; // Simulate GPS connectivity percentage
  };

  const startTracking = async () => {
    setTracking(true);
    await acquireWakeLock(); // Keep the device awake while tracking

    // Start watching the position instead of repeatedly calling getCurrentPosition
    watchId.current = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,  // Timeout if no position fix is found in 10 seconds
        maximumAge: 0,    // Avoid using cached locations
      },
      (position, err) => {
        if (err) {
          console.error("Error getting position", err);
          return;
        }

        if (position && position.coords) {
          let { latitude, longitude, speed: deviceSpeed, accuracy } = position.coords;
          const timestamp = new Date().getTime(); // Current time in milliseconds

          // Apply Kalman filter to smooth the GPS readings
          latitude = kalmanFilterLat.filter(latitude);
          longitude = kalmanFilterLon.filter(longitude);

          // Filter out inaccurate GPS readings (accuracy > 10 meters is discarded)
          if (accuracy > 10) {
            console.log('Inaccurate GPS reading discarded due to low accuracy:', accuracy);
            return;
          }

          // Use device-reported speed if available
          if (deviceSpeed !== null && deviceSpeed !== undefined) {
            const speedInKmh = deviceSpeed * 3.6; // Convert m/s to km/h
            console.log('Device-reported speed (km/h):', speedInKmh);
            setSpeed(speedInKmh);
            return;
          }

          // If we have a previous position, calculate the speed manually
          if (lastPosition.current) {
            const { lat: prevLat, lon: prevLon, timestamp: prevTimestamp } = lastPosition.current;
            const calculatedSpeedInKmh = calculateSpeed(prevLat, prevLon, prevTimestamp, latitude, longitude, timestamp);
            if (calculatedSpeedInKmh >= 5) {
              setSpeed(calculatedSpeedInKmh);
            } else {
              setSpeed(0); // If speed is below the threshold, treat as stationary
            }
          }

          // Update last position
          lastPosition.current = { lat: latitude, lon: longitude, timestamp };
        }
      }
    );
  };

  const stopTracking = () => {
    setTracking(false);
    // Clear the watch to stop the GPS tracking
    if (watchId.current) {
      Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    releaseWakeLock(); // Release wake lock when tracking stops
    lastPosition.current = null; // Reset the last known position
  };

  useEffect(() => {
    return () => {
      stopTracking(); // Cleanup when component unmounts
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Drive Safe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {!tracking ? (
          <IonButton onClick={startTracking}>Click to Start</IonButton>
        ) : (
          <>
            <h1>Your Speed: {speed.toFixed(2)} km/h</h1>
            <IonButton onClick={stopTracking}>Click to Stop</IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
// new add part for speed test function ↑↑↑


const Home: React.FC = () => {

    return (
        <IonTabs>
            {/* create bar at the bottom that holds tab buttons */}
            <IonTabBar slot="bottom" color='primary'>
                {/* tab button for home, linked to the MainHomeTab */}
                <IonTabButton tab="tab1" href="/app/home/main">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>

                {/* tab button for location, linked to the Location component */}
                <IonTabButton tab="tab2" href="/app/home/location">
                    <IonIcon icon={locationOutline} />
                    <IonLabel>Location</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                {/* route for the MainHomeTab component */}
                <Route path="/app/home/main" component={MainHomeTab} />
                {/* route for the Location component */}
                <Route path="/app/home/location" component={Location} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/main" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;
