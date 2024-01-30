import { IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import './Menu.css';

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonNote>hello@atclub.com</IonNote>
          <IonMenuToggle autoHide={false}>
            <IonItem className={location.pathname === '/home' ? 'selected' : ''} routerLink="/home" routerDirection="none" lines="none" detail={false}>
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/horses' ? 'selected' : ''} routerLink="/horses" routerDirection="none" lines="inset" detail={false}>
              <IonLabel>Horses</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/events' ? 'selected' : ''} routerLink="/events" routerDirection="none" lines="inset" detail={false}>
              <IonLabel>Events</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/schedule' ? 'selected' : ''} routerLink="/schedule" routerDirection="none" lines="inset" detail={false}>
              <IonLabel>Schedule</IonLabel>
            </IonItem>
            <IonItem routerLink="/" routerDirection="root" lines="none" detail={false}>
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
