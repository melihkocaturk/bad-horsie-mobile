import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSelect, IonSelectOption, IonSkeletonText, IonTextarea, IonThumbnail, IonTitle, IonToolbar, useIonAlert, useIonLoading, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { add, camera, closeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

const Clubs: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [clubs, setClubs] = useState<any[]>([]);
  const [clubTags, setClubTags] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const [showAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [editClub, setEditClub] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [logo, setLogo] = useState<any>(null);
  const [banner, setBanner] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [web, setWeb] = useState<string>("");
  const [coordinates, setCoordinates] = useState<string>("");
  const [tags, setTags] = useState<any[]>([]);
  const [tbf_link, setTbfLink] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const showModal = useRef<HTMLIonModalElement>(null);
  const editModal = useRef<HTMLIonModalElement>(null);
  const createModal = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    const loadClubs = async () => {
      const data = await getClubs();
      setClubs(data);
    };
    loadClubs();

    const loadTags = async () => {
      const data = await getTags();
      setClubTags(data);
    };
    loadTags();
    setLoading(false);
  });

  const getClubs = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/clubs';

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getTags = async () => {
    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const url = import.meta.env.VITE_API_URL + '/tags';

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
    formdata.append("address", address);
    formdata.append("phone", phone);
    formdata.append("email", email);
    formdata.append("web", web);
    formdata.append("coordinates", coordinates);
    tags.map((tag) => {
      formdata.append("tags[]", tag);
    });
    formdata.append("tbf_link", tbf_link);

    if (logo !== null) {
      formdata.append("logo", logo);
    }

    if (banner !== null) {
      formdata.append("banner", banner);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata
    };

    const url = import.meta.env.VITE_API_URL + '/clubs/' + id + '?_method=PUT';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setSelectedClub(data.data);
        editModal.current?.dismiss();
        showToast({
          message: 'Club successfully updated.',
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

  const doCreate = async (event: any) => {
    event.preventDefault();

    const token = await Preferences.get({ key: 'token' });

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Bearer " + token.value);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("address", address);
    formdata.append("phone", phone);
    formdata.append("email", email);
    formdata.append("web", web);
    formdata.append("coordinates", coordinates);
    tags.map((tag) => {
      formdata.append("tags[]", tag);
    });
    formdata.append("tbf_link", tbf_link);

    if (logo !== null) {
      formdata.append("logo", logo);
    }

    if (banner !== null) {
      formdata.append("banner", banner);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata
    };

    const url = import.meta.env.VITE_API_URL + '/clubs';

    await present('Saving...');

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        createModal.current?.dismiss();
        showToast({
          message: 'Club successfully created.',
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

            const url = import.meta.env.VITE_API_URL + '/clubs/' + id;

            await present('Removing...');

            try {
              const response = await fetch(url, requestOptions);
              console.log(response);

              if (response.ok) {
                editModal.current?.dismiss();
                showToast({
                  message: 'Club removed.',
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

  const selectClub = (club: any) => {
    setId(club.id);
    setName(club.name);
    setDescription(club.description);
    setLogo(null);
    setBanner(null);
    setAddress(club.address);
    setPhone(club.phone);
    setEmail(club.email);
    setWeb(club.web);
    setCoordinates(club.coordinates);
    let tagsArray: any[] = [];
    club.tags.map((tag: any) => {
      tagsArray.push(tag.id);
    });
    setTags(tagsArray);
    setTbfLink(club.tbf_link);
    setSelectedClub(club);
  };

  const displayTags = () => {
    let options: JSX.Element[] = [];

    clubTags.map((tag, index) => {
      options.push(<IonSelectOption value={tag.id} key={index}>{tag.name}</IonSelectOption>);
    });

    return options;
  }

  const doRefresh = async (event?: any) => {
    setClubs([]);
    setLoading(true);
    const data = await getClubs();
    setLoading(false);
    setClubs(data);

    if (typeof event !== 'undefined') {
      event.detail.complete();
    }
  };

  const takePicture = async (picture: string) => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    const base64Response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
    const blob = await base64Response.blob();

    if (picture === 'logo') {
      setLogo(blob);
    } else {
      setBanner(blob);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'light'}>
          <IonTitle>Clubs</IonTitle>
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

        {loading &&
          [...Array(10)].map((_, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonSkeletonText />
              </IonCardHeader>
            </IonCard>
          ))}
        {clubs.map((club, index) => (
          <IonCard button={true} key={index} onClick={() => selectClub(club)}>
            <div style={{ textAlign: 'center' }}>
              <img alt={club.name} src={club.logo} />
            </div>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">{club.name}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        ))}

        <IonModal ref={showModal} isOpen={selectedClub !== null} onIonModalDidDismiss={() => setSelectedClub(null)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => showModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>{selectedClub?.name}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding ion-margin-bottom">
            <IonCard>
              <img alt={selectedClub?.name} src={selectedClub?.banner} />
              <IonCardHeader>
                <IonItem lines="none" className="ion-no-padding">
                  <IonThumbnail slot="start">
                    <img alt="Logo" src={selectedClub?.logo} />
                  </IonThumbnail>
                  <IonLabel>{selectedClub?.name}</IonLabel>
                </IonItem>
                <IonCardSubtitle>{selectedClub?.description}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <b>Address:</b> {selectedClub?.address}<br />
                <b>Phone:</b> {selectedClub?.phone}<br />
                <b>E-mail:</b> {selectedClub?.email}<br />
                <b>Web:</b> <a href={selectedClub?.web}>{selectedClub?.web}</a><br />
                <b>Coordinates:</b> {selectedClub?.coordinates}<br />
                <b>Tags:</b>
                {selectedClub?.tags.map((tag: any, index: number) => (
                  <IonChip outline={true} key={index}>{tag.name}</IonChip>
                ))}
                <br />
                <b>Türkiye Binicilik Federasyonu Linki:</b> <a href={selectedClub?.tbf_link}>{selectedClub?.tbf_link}</a><br />
                <IonButton type="button" color={'primary'} size="default" className="ion-float-right ion-margin-bottom" onClick={() => setEditClub(true)}>Edit</IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        <IonModal ref={editModal} isOpen={editClub === true} onIonModalDidDismiss={() => setEditClub(false)}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => editModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Edit Club</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={doEdit}>
              <IonList>
                <IonItem lines="full">
                  <IonInput label="Name" labelPlacement="floating" type="text" value={selectedClub?.name} onIonChange={(e) => setName(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonTextarea label="Description" labelPlacement="floating" value={selectedClub?.description} onIonChange={(e) => setDescription(e.detail.value!)}></IonTextarea>
                </IonItem>
                <IonItem lines="full">
                  <IonLabel>Logo</IonLabel>
                  <IonButton onClick={(e) => takePicture('logo')} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonLabel>Banner</IonLabel>
                  <IonButton onClick={(e) => takePicture('banner')} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonTextarea label="Address" labelPlacement="floating" value={selectedClub?.address} onIonChange={(e) => setAddress(e.detail.value!)}></IonTextarea>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Phone" labelPlacement="floating" type="text" value={selectedClub?.phone} onIonChange={(e) => setPhone(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Email" labelPlacement="floating" type="email" value={selectedClub?.email} onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Web" labelPlacement="floating" type="url" value={selectedClub?.web} onIonChange={(e) => setWeb(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Coordinates" labelPlacement="floating" type="text" value={selectedClub?.coordinates} onIonChange={(e) => setCoordinates(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Tags" labelPlacement="floating" value={tags} onIonChange={(e) => setTags(e.detail.value!)} multiple={true}>
                    {displayTags()}
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Türkiye Binicilik Federasyonu Linki" labelPlacement="floating" type="url" value={selectedClub?.tbf_link} onIonChange={(e) => setTbfLink(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="button" color={'danger'} size="default" className="ion-float-left" onClick={doRemove}>Delete</IonButton>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal ref={createModal} trigger="create-club">
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonButtons slot="end">
                <IonButton onClick={() => createModal.current?.dismiss()}>
                  <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Add New Club</IonTitle>
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
                  <IonLabel>Logo</IonLabel>
                  <IonButton onClick={(e) => takePicture('logo')} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonLabel>Banner</IonLabel>
                  <IonButton onClick={(e) => takePicture('banner')} color={'dark'}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonButton>
                </IonItem>
                <IonItem lines="full">
                  <IonTextarea label="Address" labelPlacement="floating" onIonChange={(e) => setAddress(e.detail.value!)}></IonTextarea>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Phone" labelPlacement="floating" type="text" onIonChange={(e) => setPhone(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Email" labelPlacement="floating" type="email" onIonChange={(e) => setEmail(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Web" labelPlacement="floating" type="url" onIonChange={(e) => setWeb(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Coordinates" labelPlacement="floating" type="text" onIonChange={(e) => setCoordinates(e.detail.value!)}></IonInput>
                </IonItem>
                <IonItem lines="full">
                  <IonSelect label="Tags" labelPlacement="floating" onIonChange={(e) => setTags(e.detail.value!)} multiple={true}>
                    {displayTags()}
                  </IonSelect>
                </IonItem>
                <IonItem lines="full">
                  <IonInput label="Türkiye Binicilik Federasyonu Linki" labelPlacement="floating" type="url" onIonChange={(e) => setTbfLink(e.detail.value!)}></IonInput>
                </IonItem>
              </IonList>
              <IonButton type="submit" color={'primary'} size="default" className="ion-float-right">Save</IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton id="create-club">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Clubs;