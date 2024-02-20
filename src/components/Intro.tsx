import { IonButton, IonContent, IonFooter, IonToolbar } from '@ionic/react';
import React from 'react';
import './Intro.css'
import Welcome from '../assets/intro/welcome.mp4';

interface ContainerProps {
  onFinish: () => void;
}

const Intro: React.FC<ContainerProps> = ({ onFinish }) => {

  return (
    <IonContent>
      <video src={Welcome} autoPlay={true} loop muted />
      <IonButton color={'light'} onClick={() => onFinish()} className='intro-enter-button'>ENTER</IonButton>
    </IonContent>
  );
};

export default Intro;