import React from 'react';
import { Confirmation } from './src/pages/Confirmation'
import AppLoading from 'expo-app-loading';

import Routes from './src/routes';

import { useFonts } from 'expo-font';

import {
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';



export default function App() {


  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });


  if (!fontsLoaded) {
    return (
      <AppLoading />
    )
  }

  return (
    <Routes />
  );
}
