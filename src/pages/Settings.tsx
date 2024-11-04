import { IonAlert, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonPage, IonText, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { chevronForwardCircleOutline, fingerPrintOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [showAlert, setShowAlert] = useState(false);

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
            <IonItem>
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
                        onClick={() => setShowAlert(true)}
                    />
                </IonItem>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Error'}
                    message={'Currently not available'}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Settings;