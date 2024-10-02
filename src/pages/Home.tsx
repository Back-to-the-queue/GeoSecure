import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, personCircleOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Profile from './Profile';

const Home: React.FC = () => {

    return (
        <IonTabs>
            <IonTabBar slot="bottom" color='primary'>
                <IonTabButton tab="tab1" href="/app/home/main">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/app/home/profile">
                    <IonIcon icon={personCircleOutline} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                <Route path="/app/home/main" component={MainHomeTab} />
                <Route path="/app/home/profile" component={Profile} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/main" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;