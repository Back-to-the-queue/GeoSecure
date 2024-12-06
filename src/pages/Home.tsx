import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, locationOutline, speedometerOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Track from './Track';

const Home: React.FC = () => {

    return (
        <IonTabs>
            {/* create bar at the bottom that holds tab buttons */}
            <IonTabBar slot="bottom" color='primary'>
                {/* tab button for home, linked to the MainHomeTab */}
                {/*<IonTabButton tab="tab1" href="/app/home/main">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>*/}

                {/* tab button for track trip, linked to the Track component */}
                <IonTabButton tab="tab2" href="/app/home/track">
                    <IonIcon icon={locationOutline} />
                    <IonLabel>Track Trip</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                {/* route for the Track component */}
                <Route path="/app/home/track" component={Track} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/track" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;
