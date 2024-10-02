import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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
                    <h1>Welcome to GeoSecure</h1>
                    <h2>Our Goal</h2>
                    <p>Our goal with this project is to design, implement, and evaluate a mobile application to detect driving habits using recently developed location privacy methods by the sponsors. 
                    Our job is to create a fully working driving habit detection app that is more loction-privacy aware then ones offered by auto insurance companies.</p>
                    <h2>Why?</h2>
                    <p>We are doing this because detecting driving habits such as speeding, abrupt breaking, and running stop signs or red lights is important for improving road safety. However, people’s 
                    concern for losing location-privacy makes it difficult for driving habit detection apps to work. That’s why it’s important that we develop an app that detects all of these habits accurately, but 
                    keeps the users’ location private from any outside sources</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MainHomeTab;