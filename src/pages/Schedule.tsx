import { Preferences } from '@capacitor/preferences';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useIonViewWillEnter(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    loadEvents();
  });

  const getEvents = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/schedule';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const displaySchedule = () => {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let schedule = [];

    for (let i = 0; i <= 6; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      let day = weekday[date.getDay()];

      schedule.push(
        <IonCard key={i}>
          <IonCardHeader>
            <IonCardTitle>{day}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {events.map((event, index) => (
              new Date(event.start).getTime() >= new Date((new Date).getTime() + (86400000 * i)).getTime() &&
                new Date(event.start).getTime() < new Date((new Date).getTime() + (86400000 * (i + 1))).getTime() ?
                (
                  <IonCard key={index} color="tertiary" className="ion-margin-bottom">
                    <IonCardContent class="ion-text-center">
                      {event.name}<br />
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </IonCardContent>
                  </IonCard>
                ) : null
            ))}
          </IonCardContent>
        </IonCard>
      );
    };

    return schedule;
  };

  const doRefresh = async (event: any) => {
    setEvents([]);
    const data = await getEvents();
    setEvents(data);
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonTitle>Schedule</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {displaySchedule()}
      </IonContent>
    </IonPage>
  );
};

export default Schedule;