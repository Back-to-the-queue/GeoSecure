import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel,
  IonButton, IonLoading, IonIcon, IonAlert, useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';


const Login: React.FC = () => {
  const API_BASE_URL = 'https://4fd6tgu6vf.execute-api.us-east-1.amazonaws.com/prod';
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
      const response: AxiosResponse = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      Preferences.set({key: "userId", value: username});
      setLoading(false);
      history.push('/app');
    } catch (error: AxiosError | unknown) {
      console.error('Login failed:', error);
      setLoading(false);
      showError("bad-credentials");
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
        <IonButton expand="full" onClick={handleLogin} disabled={loading} className="ion-margin-top">
          Login
          <IonIcon icon={logInOutline} slot="end" />
        </IonButton>
        <IonLoading isOpen={loading} message={'Logging in...'} />
        <IonButton routerLink="/signup" color="secondary" expand="block" className="ion-margin-top">
          Create Account
          <IonIcon icon={personCircleOutline} slot="end" />
        </IonButton>

        <IonAlert
          isOpen={error === "bad-credentials"}
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
