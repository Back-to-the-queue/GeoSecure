import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/auth/signup', { email, password });
      console.log(response.data);
      setLoading(false);
      history.push('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
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
        <IonButton expand="full" onClick={handleSignup} disabled={loading}>Sign Up</IonButton>
        <IonLoading isOpen={loading} message={'Signing up...'} />
      </IonContent>
    </IonPage>
  );
};

export default Signup;
