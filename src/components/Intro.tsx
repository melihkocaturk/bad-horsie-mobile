import { IonButton } from '@ionic/react';
import React from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css'
import './Intro.css'
import Slide1 from '../assets/intro/slide1.png';
import Slide2 from '../assets/intro/slide2.png';
import Slide3 from '../assets/intro/slide3.png';

interface ContainerProps {
  onFinish: () => void;
}

const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return <IonButton color={'dark'} onClick={() => swiper.slideNext()}>{children}</IonButton>
}

const Intro: React.FC<ContainerProps> = ({ onFinish }) => {

  return <Swiper>
    <SwiperSlide>
      <img src={Slide1}></img>
      <SwiperButtonNext>Next</SwiperButtonNext>
    </SwiperSlide>
    <SwiperSlide>
      <img src={Slide2}></img>
      <SwiperButtonNext>Next</SwiperButtonNext>
    </SwiperSlide>
    <SwiperSlide>
      <img src={Slide3}></img>
      <IonButton color={'dark'} onClick={() => onFinish()}>Finish</IonButton>
    </SwiperSlide>
  </Swiper>;
};

export default Intro;