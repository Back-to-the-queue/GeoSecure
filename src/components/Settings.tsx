import React, { useState } from 'react';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonToggle, IonButton, IonAlert, IonIcon,
  IonText, IonButtons, IonMenuButton,}
  from '@ionic/react';
import { useHistory } from 'react-router';
import { fingerPrintOutline, notificationsOutline } from 'ionicons/icons';

const Settings: React.FC = () => {
  const history = useHistory();
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteAlert(true);
  };

  const handlePrivacyAlert = () => {
    setShowPrivacyAlert(true);
  };

  const confirmDelete = () => {
    setShowDeleteAlert(false);
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonItem>
          <IonIcon icon={fingerPrintOutline} />
          <IonLabel>
            Anonymous Data Sharing
            <IonText color="medium" style={{ display: 'block', fontSize: 'small' }}>
              Enable to share data anonymously to improve our service.
            </IonText>
          </IonLabel>
          <IonToggle slot="end"></IonToggle>
        </IonItem>
        <IonItem>
          <IonIcon icon={notificationsOutline} />
          <IonLabel>
            Real-Time Alerts
            <IonText color="medium" style={{ display: 'block', fontSize: 'small' }}>
              Receive immediate notifications.
            </IonText>
          </IonLabel>
          <IonToggle slot="end"></IonToggle>
        </IonItem>
        <IonButton expand="full" color="secondary" onClick={handlePrivacyAlert}>
          Privacy Settings
        </IonButton>
        <IonAlert
          isOpen={showPrivacyAlert}
          onDidDismiss={() => setShowPrivacyAlert(false)}
          header="Privacy Settings"
          message="This feature is not yet available."
          buttons={['OK']}
        />
        <IonButton expand="full" color="danger" onClick={handleDeleteAccount}>
          Delete Account
        </IonButton>
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm Deletion"
          message="Are you sure you want to delete your account? This action cannot be undone."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: 'Delete',
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;