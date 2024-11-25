import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, locationOutline, speedometerOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import MainHomeTab from './MainHomeTab';
import Location from './Location';
import Speed from './Speed';

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

                {/* tab button for location, linked to the Location component */}
                <IonTabButton tab="tab2" href="/app/home/location">
                    <IonIcon icon={locationOutline} />
                    <IonLabel>Location</IonLabel>
                </IonTabButton>

                {/* tab button for speed, linked to the Speed component */}
                <IonTabButton tab="tab3" href="/app/home/speed">
                    <IonIcon icon={speedometerOutline} />
                    <IonLabel>Speed</IonLabel>
                </IonTabButton>
            </IonTabBar>

            <IonRouterOutlet>
                {/* route for the Location component */}
                <Route path="/app/home/location" component={Location} />
                {/* route for the Speed component */}
                <Route path="/app/home/speed" component={Speed} />

                <Route exact path="/app/home">
                    <Redirect to="/app/home/location" />
                </Route>
            </IonRouterOutlet>
        </IonTabs>
    );
};

export default Home;
