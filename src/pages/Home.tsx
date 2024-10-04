import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, personCircleOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Profile from './Profile';

const Home: React.FC = () => {

    return (
        <IonTabs>
            {/* create bar at the bottom that holds tab buttons */}
            <IonTabBar slot="bottom" color='primary'>
                {/* tab button for home, linked to the MainHomeTab */}
                <IonTabButton tab="tab1" href="/app/home/main">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>

                {/* tab button for profile, linked to the Profile component */}
                <IonTabButton tab="tab2" href="/app/home/profile">
                    <IonIcon icon={personCircleOutline} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                {/* route for the MainHomeTab component */}
                <Route path="/app/home/main" component={MainHomeTab} />
                {/* route for the Profile component */}
                <Route path="/app/home/profile" component={Profile} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/main" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;