import { Preferences } from '@capacitor/preferences';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';

const Horses: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [horses, setHorses] = useState<any[]>([]);

  useIonViewWillEnter(() => {
    const loadHorses = async () => {
      const data = await getHorses();
      setHorses(data);
    };
    loadHorses();
    setLoading(false);
  });

  const getHorses = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/horses';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const doRefresh = async (event: any) => {
    setHorses([]);
    setLoading(true);
    const data = await getHorses();
    setLoading(false);
    setHorses(data);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonTitle>Horses</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={(event) => doRefresh(event)}>
          <IonRefresherContent />
        </IonRefresher>

        {loading &&
          [...Array(10)].map((_, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonSkeletonText animated style={{ width: '150px' }} />
              </IonCardHeader>
              <IonCardContent>
                <IonSkeletonText />
              </IonCardContent>
            </IonCard>
          ))}
        {horses.map((horse, index) => (
          <IonCard key={index}>
            <img alt={horse.name} src={horse.avatar} />
            <IonCardHeader>
              <IonCardTitle>{horse.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>{horse.description}</IonCardContent>
          </IonCard>
        ))}
        
      </IonContent>
    </IonPage>
  );
};

export default Horses;