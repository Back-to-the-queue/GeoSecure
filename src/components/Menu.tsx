import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, informationCircleOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import Settings from './Settings';
import Home from '../pages/Home';
import About from '../pages/About';

const Menu: React.FC = () => {
    //define paths for menu items and have in an array
    const paths = [
        {name: 'Home', url: '/app/home', icon: homeOutline},
        {name: 'Settings', url: '/app/settings', icon: settingsOutline},
        {name: 'About', url: '/app/about', icon: informationCircleOutline},
    ]

    return (
        <IonPage>
            {/* create side menu and the main content area */}
            <IonSplitPane contentId="main">
            {/* IonMenu is the side menu that will hold the navigation items */}
            <IonMenu contentId="main">
                <IonHeader>
                    <IonToolbar color={'secondary'}>
                        <IonTitle>Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {/* IonContent is the main content of the menu */}
                <IonContent>
                    {/* loop through the paths array to create menu items */}
                    {paths.map((item, index) => (
                        <IonMenuToggle key={index} autoHide={false}>
                            {/* IonItem represents each clickable menu option */}
                            <IonItem detail={true} routerLink={item.url} routerDirection="none">
                                <IonIcon slot="start" icon={item.icon} />
                                {item.name}
                            </IonItem>
                        </IonMenuToggle>
                    ))}

                    {/* logout button to allow users to logout */}
                    <IonMenuToggle autoHide={false}>
                            <IonButton expand="full" routerLink='/' routerDirection="root">
                                <IonIcon slot="start" icon={logOutOutline} />
                                Logout
                            </IonButton>
                        </IonMenuToggle>
                </IonContent>
            </IonMenu>

            {/* create the routes to the pages on our menu */}
            <IonRouterOutlet id="main">
                <Route exact path="/app/home" component={Home} />
                <Route path = "/app/settings" component={Settings} />
                <Route path = "/app/about" component={About} />
                <Route exact path="/app">
                    <Redirect to="/app/home" />
                </Route>
            </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};

export default Menu;