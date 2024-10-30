import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, locationOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Location from './Location';

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

                {/* tab button for location, linked to the Location component */}
                <IonTabButton tab="tab2" href="/app/home/location">
                    <IonIcon icon={locationOutline} />
                    <IonLabel>Location</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                {/* route for the MainHomeTab component */}
                <Route path="/app/home/main" component={MainHomeTab} />
                {/* route for the Location component */}
                <Route path="/app/home/location" component={Location} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/main" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;
