import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { carSportOutline } from 'ionicons/icons';
import React from 'react';

const MainHomeTab: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" fullscreen>
                <div style={{ textAlign: 'center'}}>
                    {/* all content on main page */}
                    {/* icon of a sports car to use as a sort of logo */}
                    <IonIcon icon={carSportOutline} color= "primary" style={{ fontSize: '200px' }} />
                    {/* button currently doesn't do anything, but will eventually be used to track the users trip */}
                    <IonButton expand="full" className="ion-margin-top">
                        Track Trip
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MainHomeTab;