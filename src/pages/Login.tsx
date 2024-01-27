import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonList, IonItem, IonButton, useIonRouter, useIonLoading, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Logo from '../assets/logo.png';
import Intro from '../components/Intro';
import { Preferences } from '@capacitor/preferences';

const INTRO_KEY = 'intro-seen';

const Login: React.FC = () => {
  const router = useIonRouter();
  const [introSeen, setIntroSeen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [present, dismiss] = useIonLoading();

  useEffect(() => {
    const checkStorage = async () => {
      const seen = await Preferences.get({ key: INTRO_KEY });
      setIntroSeen(seen.value === 'true');
    };
    checkStorage();
  }, []);

  const doLogin = async (event: any) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": email,
      "password": password
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const url = import.meta.env.VITE_API_URL + '/login';

    await present('Logging in...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        Preferences.set({ key: 'token', value: data.token });
        router.push("/home", "forward");
      } else {
        setMessage(data.message);
        setIsError(true);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }

    dismiss();
  };

  const finishIntro = async () => {
    setIntroSeen(true);
    Preferences.set({ key: INTRO_KEY, value: 'true' });
  };

  return (
    <>
      {!introSeen ? (
        <Intro onFinish={finishIntro} />
      ) : (

        <IonPage>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonTitle>Login</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding ion-text-center" scrollY={false}>
            <IonAlert
              isOpen={isError}
              onDidDismiss={() => setIsError(false)}
              header={"Error!"}
              message={message}
              buttons={["Dismiss"]}
            />

            <div className="ion-text-center ion-padding">
              <img src={Logo} alt="AtClub App" width={'90%'}></img>
            </div>

            <form onSubmit={doLogin}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Email" labelPlacement="floating" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Password" labelPlacement="floating" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} expand="block" className="ion-padding">Login</IonButton>
              <p style={{ fontSize: "medium" }}>
                Don't have an account? <a href="/register">Sign up!</a>
              </p>
            </form>
          </IonContent>
        </IonPage>
      )}
    </>
  );
};

export default Login;