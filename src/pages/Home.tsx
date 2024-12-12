import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { homeOutline, locationOutline } from 'ionicons/icons';
import Track from '../components/Track';

const Home: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="track" href="/app/home/track">
          <IonIcon icon={locationOutline} />
          <IonLabel>Track</IonLabel>
        </IonTabButton>
      </IonTabBar>
      <IonRouterOutlet>
        <Route path="/app/home/track" component={Track} />
        <Route exact path="/app/home">
          <Redirect to="/app/home/track" />
        </Route>
      </IonRouterOutlet>
    </IonTabs>
  );
};

export default Home;