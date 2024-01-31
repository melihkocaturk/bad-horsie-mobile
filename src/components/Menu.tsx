import { IonAvatar, IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import './Menu.css';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const Menu: React.FC = () => {
  const location = useLocation();
  const [userAvatar, setUserAvatar] = useState<any>("");
  const [userName, setUserName] = useState<any>("");
  const [userType, setUserType] = useState<any>("");

  useEffect(() => {
    const checkStorage = async () => {
      const avatar = await Preferences.get({ key: 'user-avatar' });
      setUserAvatar(avatar.value);

      const name = await Preferences.get({ key: 'user-name' });
      setUserName(name.value);

      const type = await Preferences.get({ key: 'user-type' });
      setUserType(type.value);
    };
    checkStorage();
  }, []);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonItem className="item-lines-none">
            <IonAvatar slot="start" className="ion-margin-bottom">
              <img alt={userName} src={userAvatar} />
            </IonAvatar>
            <IonLabel>{userName}</IonLabel>
          </IonItem>
          <IonMenuToggle autoHide={false}>
            <IonItem className={location.pathname === '/home' ? 'selected' : ''} routerLink="/home" routerDirection="none" lines="none" detail={false}>
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/horses' ? 'selected' : ''} routerLink="/horses" routerDirection="none" lines="none" detail={false}>
              <IonLabel>Horses</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/events' ? 'selected' : ''} routerLink="/events" routerDirection="none" lines="none" detail={false}>
              <IonLabel>Events</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/schedule' ? 'selected' : ''} routerLink="/schedule" routerDirection="none" lines="inset" detail={false}>
              <IonLabel>Schedule</IonLabel>
            </IonItem>
            <IonItem className={location.pathname === '/profile' ? 'selected' : ''} routerLink="/profile" routerDirection="none" lines="none" detail={false}>
              <IonLabel>Profile</IonLabel>
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
