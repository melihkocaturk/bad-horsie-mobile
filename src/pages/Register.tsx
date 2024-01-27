import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonList, IonItem, IonButton, IonButtons, IonBackButton, useIonRouter, IonSelect, IonSelectOption } from '@ionic/react';
import React from 'react';

const Register: React.FC = () => {
  const router = useIonRouter();

  const doRegister = (event: any) => {
    event.preventDefault();
    console.log('doRegister');
    router.goBack();
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
        <form onSubmit={doRegister}>
          <IonList>
            <IonItem>
              <IonSelect label="User Type" labelPlacement="floating">
                <IonSelectOption value="executive">Yönetici</IonSelectOption>
                <IonSelectOption value="trainer">Antrenör</IonSelectOption>
                <IonSelectOption value="student">Öğrenci</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Name" labelPlacement="floating" type="text"></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Email" labelPlacement="floating" type="email"></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Password" labelPlacement="floating" type="password"></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonInput label="Confirm Password" labelPlacement="floating" type="password"></IonInput>
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