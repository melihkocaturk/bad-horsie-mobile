import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonAvatar, IonBackButton, IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { add, addCircle, closeCircle, closeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { memberTypes } from '../variables';

interface MembersPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }

const Members: React.FC<MembersPageProps> = ({ match }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [club, setClub] = useState<any>({ name: "" });
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");
  const [user_id, setUserId] = useState<number | null>(null);
  const [user_token, setUserToken] = useState<string>("");
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const addMemberModal = useRef<HTMLIonModalElement>(null);
  const lessonRightModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadClub = async () => {
      const data = await getClub();
      setClub(data);
      setMembers(data.members);
    };
    loadClub();
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

  const addMember = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "email": email,
      "club_id": match.params.id
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/members';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        addMemberModal.current?.dismiss();
        showToast({
          message: 'New member added.',
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
  }

  const addLessonRight = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const raw = JSON.stringify({
      "user_id": user_id,
      "token": user_token
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    const url = import.meta.env.VITE_API_URL + '/lesson-rights?club_id=' + match.params.id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        lessonRightModal.current?.dismiss();
        showToast({
          message: 'Lesson right successfully created.',
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
  }

  const doRemove = (member: any) => {
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

            const url = import.meta.env.VITE_API_URL + '/members/' + member.id + '?club_id=' + match.params.id;

            await present('Removing...');

            try {
              const response = await fetch(url, requestOptions);
              console.log(response);

              if (response.ok) {
                showToast({
                  message: 'Member removed.',
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

  const selectMember = (member: any) => {
    setUserId(member.id);
    setSelectedMember(member);
  };

  const doRefresh = async (event?: any) => {
    setClub([]);
    setLoading(true);
    const data = await getClub();
    setLoading(false);
    setClub(data);
    setMembers(data.members);

    if (typeof event !== 'undefined') {
      event.detail.complete();
    }
  };

  const getMemberTypeByKey = (str: keyof typeof memberTypes) => {
    return memberTypes[str];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/clubs"></IonBackButton>
          </IonButtons>
          <IonTitle>Members</IonTitle>
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

        <IonBreadcrumbs>
          <IonBreadcrumb href="#">{club.name}</IonBreadcrumb>
          <IonBreadcrumb href="#">Members</IonBreadcrumb>
        </IonBreadcrumbs>

        {loading &&
          [...Array(5)].map((_, index) => (
            <IonItem key={index}>
              <IonAvatar slot="start">
              </IonAvatar>
              <IonLabel>
                <IonSkeletonText animated style={{ width: '200px' }} />
                <br />
                <small><IonSkeletonText animated style={{ width: '100px' }} /></small>
              </IonLabel>
            </IonItem>
          ))}
        {members.map((member, index) => (
          <IonItem key={index}>
            <IonAvatar slot="start">
              <img alt={member.name} src={member.avatar} />
            </IonAvatar>
            <IonLabel>
              {member.name}
              <br />
              <small>{getMemberTypeByKey(member.type)}</small>
            </IonLabel>
            <IonButtons slot="end">
              <IonButton onClick={() => doRemove(member)}>
                <IonIcon slot="icon-only" icon={closeCircle} color="danger"></IonIcon>
              </IonButton>
              {member.type === 'student' &&
                <IonButton onClick={() => selectMember(member)}>
                  <IonIcon slot="icon-only" icon={addCircle} color="secondary"></IonIcon>
                </IonButton>
              }
            </IonButtons>
          </IonItem>
        ))}

        <IonModal ref={lessonRightModal} isOpen={selectedMember !== null} onIonModalDidDismiss={() => setSelectedMember(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => lessonRightModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Lesson Right</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={addLessonRight}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Token" labelPlacement="floating" type="number" onIonChange={(e) => setUserToken(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Add</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal ref={addMemberModal} trigger="add-member">
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => addMemberModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Member</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={addMember}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Email" labelPlacement="floating" type="email" onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Add</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="add-member">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage >
  );
};

export default Members;