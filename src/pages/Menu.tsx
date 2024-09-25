import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import Settings from './Settings';
import Home from './Home';

const Menu: React.FC = () => {
    const paths = [
        {name: 'Home', url: '/app/home', icon: homeOutline},
        {name: 'Setting', url: '/app/settings', icon: settingsOutline},
    ]

    return (
        <IonPage>
            <IonSplitPane contentId="main">
            <IonMenu contentId="main">
                <IonHeader>
                    <IonToolbar color={'secondary'}>
                        <IonTitle>Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {paths.map((item, index) => (
                        <IonMenuToggle key={index} autoHide={false}>
                            <IonItem detail={true} routerLink={item.url} routerDirection="none">
                                <IonIcon slot="start" icon={item.icon} />
                                {item.name}
                            </IonItem>
                        </IonMenuToggle>
                    ))}

                    <IonMenuToggle autoHide={false}>
                            <IonButton expand="full" routerLink='/' routerDirection="root">
                                <IonIcon slot="start" icon={logOutOutline} />
                                Logout
                            </IonButton>
                        </IonMenuToggle>
                </IonContent>
            </IonMenu>

            <IonRouterOutlet id="main">
                <Route exact path="/app/home" component={Home} />
                <Route path = "/app/settings" component={Settings} />
                <Route exact path="/app">
                    <Redirect to="/app/home" />
                </Route>
            </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};

export default Menu;
