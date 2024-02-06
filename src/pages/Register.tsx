import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonList, IonItem, IonButton, IonButtons, IonBackButton, useIonRouter, IonSelect, IonSelectOption, IonAlert, useIonLoading } from '@ionic/react';
import React, { useState } from 'react';

const Register: React.FC = () => {
  const router = useIonRouter();
  const [type, setType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password_confirmation, setPasswordConfirmation] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [present, dismiss] = useIonLoading();

  const doRegister = async (event: any) => {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "type": type,
      "name": name,
      "email": email,
      "password": password,
      "password_confirmation": password_confirmation
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const url = import.meta.env.VITE_API_URL + '/register';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        router.goBack();
      } else {
        setMessage(data.message);
        setIsError(true);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }

    dismiss();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={false}>
        <IonAlert
          isOpen={isError}
          onDidDismiss={() => setIsError(false)}
          header={"Error!"}
          message={message}
          buttons={["Dismiss"]}
        />

        <form onSubmit={doRegister}>
          <IonList>
            <IonItem>
              <IonSelect label="User Type" labelPlacement="floating" value={type} onIonChange={(e) => setType(e.detail.value!)}>
                <IonSelectOption value="executive">Yönetici</IonSelectOption>
                <IonSelectOption value="trainer">Antrenör</IonSelectOption>
                <IonSelectOption value="student">Öğrenci</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Name" labelPlacement="floating" type="text" value={name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Email" labelPlacement="floating" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Password" labelPlacement="floating" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Confirm Password" labelPlacement="floating" type="password" value={password_confirmation} onIonChange={(e) => setPasswordConfirmation(e.detail.value!)}></IonInput>
            </IonItem>
          </IonList>
          <IonButton type="submit" color={'primary'} expand="block">Register</IonButton>
          <IonButton type="button" routerLink="/" color={'dark'} className="ion-margin-top" expand="block">Login</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;

