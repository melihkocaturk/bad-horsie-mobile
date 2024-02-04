import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonTitle, IonToolbar, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { closeOutline, checkmarkCircle, checkmarkOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';

const StudentLessons: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [present, dismiss] = useIonLoading();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [id, setId] = useState<number | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const showModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadLessons = async () => {
      const data = await getLessons();
      setLessons(data);
    };
    loadLessons();
    setLoading(false);
  });

  const getLessons = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/student/lessons';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const confirmLesson = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "student_confirmation": true,
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/student/lessons/' + id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        showModal.current?.dismiss();
        showToast({
          message: 'Lesson successfully updated.',
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

  const selectLesson = (lesson: any) => {
    setId(lesson.id);
    setSelectedLesson(lesson);
  };

  const doRefresh = async (event?: any) => {
    setLessons([]);
    setLoading(true);
    const data = await getLessons();
    setLoading(false);
    setLessons(data);

    if (typeof event !== 'undefined') {
      event.detail.complete();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonTitle>Lessons</IonTitle>
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

        {loading &&
          [...Array(5)].map((_, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle><IonSkeletonText animated style={{ width: '150px' }} /></IonCardTitle>
                <IonCardSubtitle><IonSkeletonText animated style={{ width: '200px' }} /></IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonSkeletonText animated style={{ width: '300px' }} />
              </IonCardContent>
            </IonCard>
          ))
        }
        {lessons.map((lesson, index) => (
          <IonCard button={true} key={index} onClick={() => selectLesson(lesson)}>
            <IonCardHeader>
              <IonCardTitle>{lesson.name}</IonCardTitle>
              <IonCardSubtitle>{lesson.club_name} / {lesson.trainer.name}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {new Date(lesson.start).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(lesson.end).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}
            </IonCardContent>
          </IonCard>
        ))}

        <IonModal ref={showModal} isOpen={selectedLesson !== null} onIonModalDidDismiss={() => setSelectedLesson(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => showModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>{selectedLesson?.name}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{selectedLesson?.name}</IonCardTitle>
                <IonCardSubtitle>{selectedLesson?.description}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <b>Club:</b> {selectedLesson?.club_name}<br />
                <b>Start:</b> {new Date(selectedLesson?.start).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}<br />
                <b>End:</b> {new Date(selectedLesson?.end).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })}<br />
                <b>Confirmation:</b> {selectedLesson?.student_confirmation == 1 && (<IonIcon icon={checkmarkCircle} color="success"></IonIcon>)}<br />
                <b>Trainer:</b> {selectedLesson?.trainer.name} {selectedLesson?.trainer_confirmation == 1 && (<IonIcon icon={checkmarkCircle} color="success"></IonIcon>)}<br />
                <b>Reason For Reject:</b> {selectedLesson?.reason_for_reject}<br />
                <b>Grade:</b> {selectedLesson?.grade}<br />
                <b>Comment:</b> {selectedLesson?.comment}<br />
                {selectedLesson?.student_confirmation != 1 && (
                  <IonButton type="button" color={'success'} expand="block" onClick={confirmLesson} className="ion-margin-top">
                    <IonIcon slot="start" icon={checkmarkOutline} color="light"></IonIcon>
                    Done
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default StudentLessons;