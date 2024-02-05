import { Preferences } from '@capacitor/preferences';
import { IonBackButton, IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption, IonSkeletonText, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { add, checkmarkCircle, checkmarkOutline, closeCircle, closeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';

interface LessonsPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }

const Lessons: React.FC<LessonsPageProps> = ({ match }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [club, setClub] = useState<any>({ name: "" });
  const [lessons, setLessons] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [editLesson, setEditLesson] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [trainer_id, setTrainerId] = useState<number | null>(null);
  const [student_id, setStudentId] = useState<number | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const showModal = useRef<HTMLIonModalElement>(null);
  const editModal = useRef<HTMLIonModalElement>(null);
  const createModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadClub = async () => {
      const data = await getClub();
      setClub(data);
      setMembers(data.members);
    };
    loadClub();

    const loadLessons = async () => {
      const data = await getLessons();
      setLessons(data);
    };
    loadLessons();

    setLoading(false);
  });

  const getClub = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/clubs/' + match.params.id;

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getLessons = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/lessons?club_id=' + match.params.id;

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
      "end": end,
      "trainer_id": trainer_id,
      "student_id": student_id
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/lessons/' + id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setSelectedLesson(data.data);
        editModal.current?.dismiss();
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
      "end": end,
      "trainer_id": trainer_id,
      "student_id": student_id
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/lessons?club_id=' + match.params.id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        createModal.current?.dismiss();
        showToast({
          message: 'Lesson successfully created.',
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

            const url = import.meta.env.VITE_API_URL + '/lessons/' + id;

            await present('Removing...');

            try {
              const response = await fetch(url, requestOptions);
              console.log(response);

              if (response.ok) {
                editModal.current?.dismiss();
                showModal.current?.dismiss();
                showToast({
                  message: 'Lesson removed.',
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
  }

  const selectLesson = (lesson: any) => {
    setId(lesson.id);
    setName(lesson.name);
    setStart(lesson.start);
    setEnd(lesson.end);
    setTrainerId(lesson.trainer.id);
    setStudentId(lesson.student.id);
    setSelectedLesson(lesson);
  };

  const displayTrainers = () => {
    let options: JSX.Element[] = [];

    members?.map((member, index) => {
      if (member.type == 'trainer') {
        options.push(<IonSelectOption value={member.id} key={index}>{member.name}</IonSelectOption>);
      }
    });

    return options;
  }

  const displayStudents = () => {
    let options: JSX.Element[] = [];

    members?.map((member, index) => {
      if (member.type == 'student') {
        options.push(<IonSelectOption value={member.id} key={index}>{member.name}</IonSelectOption>);
      }
    });

    return options;
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
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/clubs"></IonBackButton>
          </IonButtons>
          <IonTitle>Lessons</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={(event) => doRefresh(event)}>
          <IonRefresherContent />
        </IonRefresher>

        <IonBreadcrumbs>
          <IonBreadcrumb href="#">{club.name}</IonBreadcrumb>
          <IonBreadcrumb href="#">Lessons</IonBreadcrumb>
        </IonBreadcrumbs>

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
              <IonCardSubtitle>{lesson.trainer.name} / {lesson.student.name}</IonCardSubtitle>
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
                <b>Trainer:</b> {selectedLesson?.trainer.name} {selectedLesson?.trainer_confirmation == 0 && (<IonIcon icon={closeCircle} color="danger"></IonIcon>) || selectedLesson?.trainer_confirmation == 1 && (<IonIcon icon={checkmarkCircle} color="success"></IonIcon>)}<br />
                <b>Reason For Reject:</b> {selectedLesson?.reason_for_reject}<br />
                <b>Grade:</b> {selectedLesson?.grade}<br />
                <b>Comment:</b> {selectedLesson?.comment}<br />
                <IonButton type="button" color={'primary'} size="default" className="ion-float-right ion-margin-bottom" onClick={() => setEditLesson(true)}>Edit</IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        <IonModal ref={editModal} isOpen={editLesson === true} onIonModalDidDismiss={() => setEditLesson(false)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => editModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Edit Lesson</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doEdit}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" value={selectedLesson?.name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Start" labelPlacement="floating" type="datetime-local" value={selectedLesson?.start} onIonChange={(e) => setStart(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="End" labelPlacement="floating" type="datetime-local" value={selectedLesson?.end} onIonChange={(e) => setEnd(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Trainer" value={selectedLesson?.trainer.id} labelPlacement="floating" onIonChange={(e) => setTrainerId(e.detail.value!)}>
                    {displayTrainers()}
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Student" value={selectedLesson?.student.id} labelPlacement="floating" onIonChange={(e) => setStudentId(e.detail.value!)}>
                    {displayStudents()}
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonButton type="button" color={'danger'} size="default" className="ion-float-left" onClick={doRemove}>Delete</IonButton>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal ref={createModal} trigger="create-lesson">
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => createModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Lesson</IonTitle>
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
                <IonItem lines="full">
                  <IonSelect label="Trainer" labelPlacement="floating" onIonChange={(e) => setTrainerId(e.detail.value!)}>
                    {displayTrainers()}
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Student" labelPlacement="floating" onIonChange={(e) => setStudentId(e.detail.value!)}>
                    {displayStudents()}
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="create-lesson">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Lessons;