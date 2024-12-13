import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonIcon,
  IonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

const Login: React.FC = () => {
  const API_BASE_URL = 'https://eo16nb655e.execute-api.us-east-1.amazonaws.com/production';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, showError] = useState('');
  const history = useHistory();

  useIonViewWillEnter(() => {
    setUsername('');
    setPassword('');
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const { token } = response.data;

      // Save the token to localStorage
      localStorage.setItem('authToken', token);

      // Decode the token manually
      const decodedToken = decodeJWT(token);
      const userRole = decodedToken.role;

      // Store user role locally if needed
      localStorage.setItem('userRole', userRole);

      // Redirect based on role
      if (userRole === 'admin') {
        history.push('/admin-dashboard');
      } else {
        history.push('/app');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showError('bad-credentials');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode JWT manually
  const decodeJWT = (token: string) => {
    try {
      const [, payload] = token.split('.'); // Extract the payload (middle part of JWT)
      if (!payload) throw new Error('Invalid token format');

      // Decode Base64 payload
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload); // Parse JSON string into object
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      throw error;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            type="text"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value!)}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
            required
          />
        </IonItem>
        <IonButton
          expand="full"
          onClick={handleLogin}
          disabled={loading}
          className="ion-margin-top"
        >
          Login
          <IonIcon icon={logInOutline} slot="end" />
        </IonButton>
        <IonLoading isOpen={loading} message={'Logging in...'} />
        <IonButton routerLink="/signup" color="secondary" expand="block" className="ion-margin-top">
          Create Account
          <IonIcon icon={personCircleOutline} slot="end" />
        </IonButton>

        <IonAlert
          isOpen={error === 'bad-credentials'}
          header="Invalid Credentials"
          message="Please check your input and try again."
          buttons={['CLOSE']}
          onDidDismiss={() => showError('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
