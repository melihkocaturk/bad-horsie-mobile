import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonText, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { closeOutline, add } from 'ionicons/icons';
import './Events.css';

const Events: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const editModal = useRef<HTMLIonModalElement>(null);
  const createModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    loadEvents();
    setLoading(false);
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

    const url = import.meta.env.VITE_API_URL + '/events';

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
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "name": name,
      "start": start,
      "end": end
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/events/' + id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        editModal.current?.dismiss();
        showToast({
          message: 'Event successfully updated.',
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

  const doCreate = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "name": name,
      "start": start,
      "end": end
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/events';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        createModal.current?.dismiss();
        showToast({
          message: 'Event successfully created.',
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

  const doRemove = (event: any) => {
    event.preventDefault();

    showAlert({
      header: 'Delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            const token = await Preferences.get({ key: 'token' });

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", "Bearer " + token.value);

            const requestOptions = {
              method: 'DELETE',
              headers: myHeaders
            };

            const url = import.meta.env.VITE_API_URL + '/events/' + id;

            await present('Removing...');

            try {
              const response = await fetch(url, requestOptions);

              if (response.ok) {
                editModal.current?.dismiss();
                showToast({
                  message: 'Event removed.',
                  duration: 2000,
                  color: 'success'
                });
                doRefresh();
              } else {
                setMessage('Something went wrong!');
                setIsError(true);
                throw new Error('Something went wrong!');
              }
            } catch (error) {
              console.error(error);
            }

            dismiss();
          }
        }
      ]
    });
  };

  const selectEvent = (event: any) => {
    setId(event.id);
    setName(event.name);
    setStart(event.start);
    setEnd(event.end);
    setSelectedEvent(event);
  };

  const doRefresh = async (event?: any) => {
    setEvents([]);
    setLoading(true);
    const data = await getEvents();
    setLoading(false);
    setEvents(data);

    if (typeof event !== 'undefined') {
      event.detail.complete();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonTitle>Events</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonAlert
          isOpen={isError}
          onDidDismiss={() => setIsError(false)}
          header={"Error!"}
          message={message}
          buttons={["Dismiss"]}
        />

        <IonList>
          {loading &&
            [...Array(5)].map((_, index) => (
              <IonItem button={true} detail={false} key={index}>
                <div className="unread-indicator-wrapper" slot="start">
                  <div className="indicator outdated"></div>
                </div>
                <IonLabel>
                  <strong><IonSkeletonText /></strong>
                  <br />
                  <IonText><IonSkeletonText /></IonText>
                </IonLabel>
              </IonItem>
            ))}
          {events.map((event, index) => (
            <IonItem button={true} detail={false} key={index} onClick={() => selectEvent(event)}>
              <div className="unread-indicator-wrapper" slot="start">
                {new Date(event.end) > new Date() ? (
                  <div className="indicator"></div>
                ) : (
                  <div className="indicator outdated"></div>
                )}
              </div>
              <IonLabel>
                <strong>{event.name}</strong>
                <br />
                <IonText>{event.start} - {event.end}</IonText>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonModal ref={editModal} isOpen={selectedEvent !== null} onIonModalDidDismiss={() => setSelectedEvent(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => editModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Edit Event</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doEdit}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" value={selectedEvent?.name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Start" labelPlacement="floating" type="datetime-local" value={selectedEvent?.start} onIonChange={(e) => setStart(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="End" labelPlacement="floating" type="datetime-local" value={selectedEvent?.end} onIonChange={(e) => setEnd(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="button" color={'danger'} size="default" className="ion-float-left" onClick={doRemove}>Delete</IonButton>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal ref={createModal} trigger="create-event">
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => createModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Event</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doCreate}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Start" labelPlacement="floating" type="datetime-local" onIonChange={(e) => setStart(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="End" labelPlacement="floating" type="datetime-local" onIonChange={(e) => setEnd(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="create-event">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Events;