import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonLoading, IonIcon, IonBackButton, IonButtons } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { checkmarkDoneOutline } from 'ionicons/icons';

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
        <IonToolbar color={'primary'}>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput className="ion-margin-top" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} required />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput className="ion-margin-top" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} required />
        </IonItem>
        <IonButton expand="full" onClick={handleSignup} disabled={loading} className="ion-margin-top">
          Sign Up
          <IonIcon icon={checkmarkDoneOutline} slot="end" />
        </IonButton>
        <IonLoading isOpen={loading} message={'Signing up...'} />
      </IonContent>
    </IonPage>
  );
};

export default Signup;
