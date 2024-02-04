import { IonAvatar, IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonNote, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { Route, useLocation } from 'react-router-dom';
import './Menu.css';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Horses from '../pages/Horses';
import Events from '../pages/Events';
import Schedule from '../pages/Schedule';
import Profile from '../pages/Profile';
import StudentLessons from '../pages/StudentLessons';
import TrainerLessons from '../pages/TrainerLessons';
import Clubs from '../pages/Clubs';

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
    <IonPage>
      <IonSplitPane contentId="main">
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
                <IonItem className={location.pathname === '/app/home' ? 'selected' : ''} routerLink="/app/home" routerDirection="none" lines="none" detail={false}>
                  <IonLabel>Home</IonLabel>
                </IonItem>
                {userType === 'student' &&
                  <>
                    <IonItem className={location.pathname === '/app/horses' ? 'selected' : ''} routerLink="/app/horses" routerDirection="none" lines="none" detail={false}>
                      <IonLabel>Horses</IonLabel>
                    </IonItem>
                    <IonItem className={location.pathname === '/app/student/lessons' ? 'selected' : ''} routerLink="/app/student/lessons" routerDirection="none" lines="none" detail={false}>
                      <IonLabel>Lessons</IonLabel>
                    </IonItem>
                  </>
                  || userType === 'trainer' &&
                  <>
                    <IonItem className={location.pathname === '/app/trainer/lessons' ? 'selected' : ''} routerLink="/app/trainer/lessons" routerDirection="none" lines="none" detail={false}>
                      <IonLabel>Lessons</IonLabel>
                    </IonItem>
                  </>
                  || userType === 'executive' &&
                  <>
                    <IonItem className={location.pathname === '/app/clubs' ? 'selected' : ''} routerLink="/app/clubs" routerDirection="none" lines="none" detail={false}>
                      <IonLabel>Clubs</IonLabel>
                    </IonItem>
                  </>
                }
                <IonItem className={location.pathname === '/app/events' ? 'selected' : ''} routerLink="/app/events" routerDirection="none" lines="none" detail={false}>
                  <IonLabel>Events</IonLabel>
                </IonItem>
                <IonItem className={location.pathname === '/app/schedule' ? 'selected' : ''} routerLink="/app/schedule" routerDirection="none" lines="inset" detail={false}>
                  <IonLabel>Schedule</IonLabel>
                </IonItem>
                <IonItem className={location.pathname === '/app/profile' ? 'selected' : ''} routerLink="/app/profile" routerDirection="none" lines="none" detail={false}>
                  <IonLabel>Profile</IonLabel>
                </IonItem>
                <IonItem routerLink="/" routerDirection="root" lines="none" detail={false}>
                  <IonLabel>Logout</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id="main">
          <Route component={Menu} path="/app" />
          <Route component={Login} path="/" exact={true} />
          <Route component={Register} path="/register" exact={true} />
          <Route component={Home} path="/app/home" exact={true} />
          <Route component={Horses} path="/app/horses" exact={true} />
          <Route component={Events} path="/app/events" exact={true} />
          <Route component={Schedule} path="/app/schedule" exact={true} />
          <Route component={Profile} path="/app/profile" exact={true} />
          <Route component={StudentLessons} path="/app/student/lessons" exact={true} />
          <Route component={TrainerLessons} path="/app/trainer/lessons" exact={true} />
          <Route component={Clubs} path="/app/clubs" exact={true} />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
