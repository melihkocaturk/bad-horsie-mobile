import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { camera } from 'ionicons/icons';
import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const [showToast] = useIonToast();
  const [present, dismiss] = useIonLoading();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<any>(null);
  const [tbf_link, setTbfLink] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useIonViewWillEnter(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setTbfLink(data.tbf_link);
    };
    loadProfile();
    setLoading(false);
  });

  const getProfile = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/profile';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const doEdit = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("tbf_link", tbf_link);

    if (avatar !== null) {
      formdata.append("avatar", avatar);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata
    };

    const url = import.meta.env.VITE_API_URL + '/profile?_method=PATCH';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setProfile(data.data);
        showToast({
          message: 'Profile successfully updated.',
          duration: 2000,
          color: 'success'
        });
        doRefresh();
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

  const doRefresh = async (event?: any) => {
    setProfile([]);
    setLoading(true);
    const data = await getProfile();
    setLoading(false);
    setProfile(data);

    Preferences.set({ key: 'user-name', value: data.name });
    Preferences.set({ key: 'user-avatar', value: data.avatar });

    if (typeof event !== 'undefined') {
      event.detail.complete();
    }
  };

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    const base64Response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
    const blob = await base64Response.blob();
    setAvatar(blob);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile Information</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={(event) => doRefresh(event)}>
          <IonRefresherContent />
        </IonRefresher>

        <IonAlert
          isOpen={isError}
          onDidDismiss={() => setIsError(false)}
          header={"Error!"}
          message={message}
          buttons={["Dismiss"]}
        />

        {!loading &&
          <form onSubmit={doEdit}>
            <IonList>
              <IonItem lines="full">
                <IonInput label="Name" labelPlacement="floating" type="text" value={profile?.name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem lines="full">
                <IonInput label="Email" labelPlacement="floating" type="email" value={profile?.email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>Avatar</IonLabel>
                <IonButton onClick={takePicture} color={'dark'}>
                  <IonIcon icon={camera}></IonIcon>
                </IonButton>
              </IonItem>
              <IonItem lines="full">
                <IonInput label="Türkiye Binicilik Federasyonu Linki" labelPlacement="floating" type="url" value={profile?.tbf_link} onIonChange={(e) => setTbfLink(e.detail.value!)}></IonInput>
              </IonItem>
            </IonList>
            <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
          </form>
        }
      </IonContent>
    </IonPage>


  );
};

export default Profile;