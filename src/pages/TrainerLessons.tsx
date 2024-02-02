import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption, IonSkeletonText, IonTextarea, IonTitle, IonToggle, IonToolbar, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { checkmarkCircle, closeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

const TrainerLessons: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [present, dismiss] = useIonLoading();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [id, setId] = useState<number | null>(null);
  const [trainer_confirmation, setTrainerConfirmation] = useState<boolean>(false);
  const [reason_for_reject, setReasonForReject] = useState<string>("");
  const [horse_id, setHorseId] = useState<number | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const showModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadEvents = async () => {
      const data = await getLessons();
      setLessons(data);
    };
    loadEvents();
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

    const url = import.meta.env.VITE_API_URL + '/trainer/lessons';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const doApprove = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "trainer_confirmation": trainer_confirmation,
      "reason_for_reject": reason_for_reject
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/trainer/lessons/' + id;

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

  const doGrade = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "horse_id": horse_id,
      "grade": grade,
      "comment": comment
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/trainer/lessons/' + id;

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
    setHorseId(lesson.horse_id);
    setGrade(lesson.grade);
    setComment(lesson.comment);
    setSelectedLesson(lesson);
  };

  const toogleApprove = (event: any) => {
    event.preventDefault();
    setTrainerConfirmation(!trainer_confirmation);
  }

  const getHorses = () => {
    let horses: JSX.Element[] = [];

    selectedLesson.club_horses.map((horse: any) => {
      horses.push(
        <IonSelectOption key={horse.id} value={horse.id}>{horse.name}</IonSelectOption>
      );
    });

    selectedLesson.student_horses.map((horse: any) => {
      horses.push(
        <IonSelectOption key={horse.id} value={horse.id}>{horse.name}</IonSelectOption>
      );
    });

    return horses;
  }

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
              <IonCardSubtitle>{lesson.club_name} / {lesson.student.name}</IonCardSubtitle>
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
                <b>Student:</b> {selectedLesson?.student.name} {selectedLesson?.student_confirmation == 1 && (<IonIcon icon={checkmarkCircle} color="success"></IonIcon>)}<br />
                <b>Confirmation:</b> {selectedLesson?.trainer_confirmation == 1 && (<IonIcon icon={checkmarkCircle} color="success"></IonIcon>)}<br />
                <b>Reason For Reject:</b> {selectedLesson?.reason_for_reject}<br />
                <b>Grade:</b> {selectedLesson?.grade}<br />
                <b>Comment:</b> {selectedLesson?.comment}<br />
              </IonCardContent>
            </IonCard>

            {selectedLesson?.trainer_confirmation == null && (
              <form onSubmit={doApprove}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Approve Lesson</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="full">
                        <IonToggle justify="start" key={'approveToggle'} color="success" onIonChange={(e) => toogleApprove(e)}>Approve</IonToggle>
                      </IonItem>
                      <IonItem lines="full">
                        <IonTextarea label="Reason For Reject" labelPlacement="floating" onIonChange={(e) => setReasonForReject(e.detail.value!)}></IonTextarea>
                      </IonItem>
                    </IonList>
                    <IonButton type="submit" color={'primary'} size="default" className="ion-float-right ion-margin-bottom">Save</IonButton>
                  </IonCardContent>
                </IonCard>
              </form>
            )}

            {selectedLesson?.trainer_confirmation == 1 && (
              <form onSubmit={doGrade}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Student Grade</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="full">
                        <IonSelect label="Horse" labelPlacement="floating" value={selectedLesson?.horse?.id} onIonChange={(e) => setHorseId(e.detail.value!)}>
                          {getHorses()}
                        </IonSelect>
                      </IonItem>
                      <IonItem lines="full">
                        <IonSelect label="Grade" labelPlacement="floating" value={selectedLesson?.grade} onIonChange={(e) => setGrade(e.detail.value!)}>
                          {[1, 2, 3, 4, 5].map((value, index) => (
                            <IonSelectOption key={index} value={value}>{value}</IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                      <IonItem lines="full">
                        <IonTextarea label="Comment" labelPlacement="floating" value={selectedLesson?.comment} onIonChange={(e) => setComment(e.detail.value!)}></IonTextarea>
                      </IonItem>
                    </IonList>
                    <IonButton type="submit" color={'primary'} size="default" className="ion-float-right ion-margin-bottom">Save</IonButton>
                  </IonCardContent>
                </IonCard>
              </form>
            )}
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default TrainerLessons;