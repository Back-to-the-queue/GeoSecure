import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonText, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { chevronForwardCircleOutline, closeCircleOutline, fingerPrintOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

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
        //navigate to login page
        history.push('/login');
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
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
            <IonItem button onClick={handlePrivacyAlert} lines="full">
                <IonIcon icon={personOutline} />
                <IonLabel>
                     Adjust Privacy Settings
                    <IonText color="medium" style={{ display: 'block', fontSize: 'small' }}>
                        Customize privacy preferences for your account.
                    </IonText>
                </IonLabel>
                <IonIcon
                    icon={chevronForwardCircleOutline}
                    slot="end"
                />
            </IonItem>
            <IonAlert
                isOpen={showPrivacyAlert}
                onDidDismiss={() => setShowPrivacyAlert(false)}
                header={'Error'}
                message={'Currently not available'}
                buttons={['OK']}
            />
            
            <IonButton expand="full" color="danger" onClick={handleDeleteAccount}>
            <IonIcon slot="start" icon={closeCircleOutline} />
            Delete Account
            </IonButton>

            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header={'Are you sure?'}
                message={'This action cannot be undone.'}
                buttons={[
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => setShowDeleteAlert(false),
                },
                {
                    text: 'Yes',
                    handler: confirmDelete,
                }
            ]}
            />

            </IonContent>
        </IonPage>
    );
};

export default Settings;