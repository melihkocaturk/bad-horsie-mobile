import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Menu from './components/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Horses from './pages/Horses';
import Events from './pages/Events';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route component={Login} path="/" exact={true} />
            <Route component={Register} path="/register" exact={true} />
            <Route component={Home} path="/home" exact={true} />
            <Route component={Horses} path="/horses" exact={true} />
            <Route component={Events} path="/events" exact={true} />
            <Route component={Schedule} path="/schedule" exact={true} />
            <Route component={Profile} path="/profile" exact={true} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
