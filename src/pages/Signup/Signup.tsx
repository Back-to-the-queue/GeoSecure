import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonLoading, IonIcon, IonBackButton, IonButtons, IonAlert, IonList } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios, {AxiosResponse, AxiosError} from 'axios';
import { checkmarkDoneOutline } from 'ionicons/icons';

const Signup: React.FC = () => {
  const API_BASE_URL = 'https://4fd6tgu6vf.execute-api.us-east-1.amazonaws.com/prod';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, showError] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    if (password != confirmPassword)
    {
      showError("different-passwords");
    }
    else
    {
      setLoading(true);

      axios.post(`${API_BASE_URL}/signup`, {email, username, password})
      .then((response: AxiosResponse) => {
        console.log(response.data);
        setLoading(false);
        history.push('/login');
      })
      .catch((error: AxiosError) => {
        console.error('Error during signup:', error);
        setLoading(false);
  
        if (error.response!.status == 500)
        {
          showError("empty-field");
        }
        else if (error.response!.status == 400)
        {
          showError("existing-account");
        }
      })
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
        <IonList>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput className="ion-margin-top" type="email" value={email} onIonInput={(e) => setEmail(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput className="ion-margin-top" type="text" value={username} onIonInput={(e) => setUsername(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput className="ion-margin-top" type="password" value={password} onIonInput={(e) => setPassword(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Re-enter Password</IonLabel>
            <IonInput className="ion-margin-top" type="password" value={confirmPassword} onIonInput={(e) => setConfirmPassword(e.detail.value!)} required />
          </IonItem>
          <IonButton expand="full" onClick={handleSignup} disabled={loading} className="ion-margin-top">
            Sign Up
            <IonIcon icon={checkmarkDoneOutline} slot="end" />
          </IonButton>
        </IonList>

        <IonLoading isOpen={loading} message={'Signing up...'} />

        <IonAlert
          isOpen={error=="empty-field"}
          header="Empty Fields Present"
          message="Please fill all fields before proceeding"
          buttons={['CLOSE']}
          onDidDismiss={() => showError('')}
        ></IonAlert>
        <IonAlert
          isOpen={error=="existing-account"}
          header="Email in Use"
          message="The provided email already has an account with this service"
          buttons={['CLOSE']}
          onDidDismiss={() => showError('')}
        ></IonAlert>
        <IonAlert
          isOpen={error=="different-passwords"}
          header="Passwords Do Not Match"
          message="Please make sure both password fields are the same."
          buttons={['CLOSE']}
          onDidDismiss={() => showError('')}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
