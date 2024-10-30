import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonLoading, IonIcon, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError} from 'axios';
import {logInOutline, personCircleOutline} from 'ionicons/icons';

const Login: React.FC = () => {
  const API_BASE_URL = 'https://mweziomrrb.execute-api.us-east-1.amazonaws.com/prod';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, showError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    
    axios.post(`${API_BASE_URL}/login`, { email, password })
    .then((response: AxiosResponse) => {
      //Extract the token from response (assuming JWT-based authentication)
      const { token } = response.data;
      //Save the token to localStorage for future authenticated requests
      localStorage.setItem('authToken', token);
      //Redirect to home or dashboard page after successful login
      setLoading(false);
      history.push('/app');
    })
    .catch((error: AxiosError) => {
      console.error('Login failed:', error);
      setLoading(false);
      //Handle error (e.g., show a message to the user)
      showError("bad-credentials");
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput className="ion-margin-top" type="email" value={email} onIonInput={(e) => setEmail(e.detail.value!)} required />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput className="ion-margin-top" type="password" value={password} onIonInput={(e) => setPassword(e.detail.value!)} required />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin} disabled={loading} className="ion-margin-top">
          Login
          <IonIcon icon={logInOutline} slot="end" />
        </IonButton>
        <IonLoading isOpen={loading} message={'Logging in...'} />
        <IonButton routerLink="/signup" color={'secondary'} type="button" expand="block" className="ion-margin-top">
          Create Account
          <IonIcon icon={personCircleOutline} slot="end" />
        </IonButton>

        <IonAlert
          isOpen={error=="bad-credentials"}
          header="Invalid Credentials"
          message="Incorrect email or password."
          buttons={['CLOSE']}
          onDidDismiss={() => showError('')}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default Login;
