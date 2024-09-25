import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Settings: React.FC = () => {

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
                <div style={{ textAlign: 'center'}}>
                    <h1>Coming Soon!</h1>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Settings;