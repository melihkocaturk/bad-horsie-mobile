import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonBackButton, IonBreadcrumb, IonBreadcrumbs, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption, IonSkeletonText, IonTextarea, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { horseGenders } from '../variables';
import { Camera, CameraResultType } from '@capacitor/camera';
import { add, camera, closeOutline } from 'ionicons/icons';

interface ClubHorsesPageProps
  extends RouteComponentProps<{
    id: string;
  }> { }

const ClubHorses: React.FC<ClubHorsesPageProps> = ({ match }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [club, setClub] = useState<any>({ name: "" });
  const [horses, setHorses] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [selectedHorse, setSelectedHorse] = useState<any>(null);
  const [editHorse, setEditHorse] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<any>(null);
  const [gender, setGender] = useState<string>("");
  const [race, setRace] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [fei_id, setFeiId] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const showModal = useRef<HTMLIonModalElement>(null);
  const editModal = useRef<HTMLIonModalElement>(null);
  const createModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadClub = async () => {
      const data = await getClub();
      setClub(data);
      setHorses(data.horses);
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

  const doEdit = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("gender", gender);
    formdata.append("race", race);
    formdata.append("color", color);
    formdata.append("height", height);
    formdata.append("fei_id", fei_id);

    if (avatar !== null) {
      formdata.append("avatar", avatar);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata
    };

    const url = import.meta.env.VITE_API_URL + '/horses/' + id + '?_method=PUT';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setSelectedHorse(data.data);
        editModal.current?.dismiss();
        showToast({
          message: 'Horse successfully updated.',
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
    myHeaders.append("Authorization", "Bearer " + token.value);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("gender", gender);
    formdata.append("race", race);
    formdata.append("color", color);
    formdata.append("height", height);
    formdata.append("fei_id", fei_id);

    if (avatar !== null) {
      formdata.append("avatar", avatar);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata
    };

    const url = import.meta.env.VITE_API_URL + '/horses?club_id=' + match.params.id;

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        createModal.current?.dismiss();
        showToast({
          message: 'Horse successfully created.',
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

            const url = import.meta.env.VITE_API_URL + '/horses/' + id;

            await present('Removing...');

            try {
              const response = await fetch(url, requestOptions);

              if (response.ok) {
                editModal.current?.dismiss();
                showToast({
                  message: 'Horse removed.',
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

  const selectHorse = (horse: any) => {
    setId(horse.id);
    setName(horse.name);
    setAvatar(null);
    setDescription(horse.description);
    setGender(horse.gender);
    setRace(horse.race);
    setColor(horse.color);
    setHeight(horse.height);
    setFeiId(horse.fei_id);
    setSelectedHorse(horse);
  };

  const doRefresh = async (event?: any) => {
    setClub([]);
    setLoading(true);
    const data = await getClub();
    setLoading(false);
    setClub(data);
    setHorses(data.horses);

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

  const getHorseGenderByKey = (str: keyof typeof horseGenders) => {
    return horseGenders[str];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/clubs"></IonBackButton>
          </IonButtons>
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

        <IonAlert
          isOpen={isError}
          onDidDismiss={() => setIsError(false)}
          header={"Error!"}
          message={message}
          buttons={["Dismiss"]}
        />

        <IonBreadcrumbs>
          <IonBreadcrumb href="#">{club.name}</IonBreadcrumb>
          <IonBreadcrumb href="#">Horses</IonBreadcrumb>
        </IonBreadcrumbs>

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
          <IonCard button={true} key={index} onClick={() => selectHorse(horse)}>
            <div style={{ textAlign: 'center' }}>
              <img alt={horse.name} src={horse.avatar} />
            </div>
            <IonCardHeader>
              <IonCardTitle>{horse.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>{horse.description}</IonCardContent>
          </IonCard>
        ))}

        <IonModal ref={showModal} isOpen={selectedHorse !== null} onIonModalDidDismiss={() => setSelectedHorse(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => showModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>{selectedHorse?.name}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <img alt={selectedHorse?.name} src={selectedHorse?.avatar} />
              <IonCardHeader>
                <IonCardTitle>{selectedHorse?.name}</IonCardTitle>
                <IonCardSubtitle>{selectedHorse?.description}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <b>Gender:</b> {getHorseGenderByKey(selectedHorse?.gender)}<br />
                <b>Race:</b> {selectedHorse?.race}<br />
                <b>Color:</b> {selectedHorse?.color}<br />
                <b>Height:</b> {selectedHorse?.height}<br />
                <b>FEI ID:</b> {selectedHorse?.fei_id}<br />
                <IonButton type="button" color={'primary'} size="default" className="ion-float-right ion-margin-bottom" onClick={() => setEditHorse(true)}>Edit</IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        <IonModal ref={editModal} isOpen={editHorse === true} onIonModalDidDismiss={() => setEditHorse(false)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => editModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Edit Horse</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doEdit}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" value={selectedHorse?.name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Description" labelPlacement="floating" type="text" value={selectedHorse?.description} onIonChange={(e) => setDescription(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonLabel>Avatar</IonLabel>
                  <IonButton onClick={takePicture} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Gender" labelPlacement="floating" value={selectedHorse?.gender} onIonChange={(e) => setGender(e.detail.value!)}>
                    <IonSelectOption value="male">Erkek</IonSelectOption>
                    <IonSelectOption value="female">Dişi</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Race" labelPlacement="floating" type="text" value={selectedHorse?.race} onIonChange={(e) => setRace(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Color" labelPlacement="floating" type="text" value={selectedHorse?.color} onIonChange={(e) => setColor(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Height" labelPlacement="floating" type="text" value={selectedHorse?.height} onIonChange={(e) => setHeight(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="FEI ID" labelPlacement="floating" type="text" value={selectedHorse?.fei_id} onIonChange={(e) => setFeiId(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="button" color={'danger'} size="default" className="ion-float-left" onClick={doRemove}>Delete</IonButton>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal ref={createModal} trigger="create-horse">
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => createModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Horse</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doCreate}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonTextarea label="Description" labelPlacement="floating" onIonChange={(e) => setDescription(e.detail.value!)}></IonTextarea>
                </IonItem>
                <IonItem lines="full">
                  <IonLabel>Avatar</IonLabel>
                  <IonButton onClick={takePicture} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Gender" labelPlacement="floating" onIonChange={(e) => setGender(e.detail.value!)}>
                    <IonSelectOption value="male">Erkek</IonSelectOption>
                    <IonSelectOption value="female">Dişi</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Race" labelPlacement="floating" type="text" onIonChange={(e) => setRace(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Color" labelPlacement="floating" type="text" onIonChange={(e) => setColor(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Height" labelPlacement="floating" type="text" onIonChange={(e) => setHeight(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="FEI ID" labelPlacement="floating" type="text" onIonChange={(e) => setFeiId(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="create-horse">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default ClubHorses;