import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5001/auth/login', { email, password });
      
      // Extract the token from response (assuming JWT-based authentication)
      const { token } = response.data;

      // Save the token to localStorage for future authenticated requests
      localStorage.setItem('authToken', token);

      // Redirect to home or dashboard page after successful login
      setLoading(false);
      history.push('/home'); // Assuming you have a 'home' page
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} required />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} required />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin} disabled={loading}>
          Login
        </IonButton>
        <IonLoading isOpen={loading} message={'Logging in...'} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
