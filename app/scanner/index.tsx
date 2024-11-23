import { CameraView, useCameraPermissions } from "expo-camera";
import { AppState, Linking, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { Link, Stack } from "expo-router";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import Popup from "../Popup";

export let isbn: string;

export default function Home() {

  const barcodeLock = useRef(false);
  const appState = useRef(AppState.currentState);
  

  // State to track invalid barcode notifications
  const [invalidBarcode, setInvalidBarcode] = useState(false);
  const [popupVisible, setPopup] = useState(false);
  const [scanning, setScanning] = useState(true); 

  const handleErrorClick = () => {
    setPopup(false);
    setScanning(true);
    barcodeLock.current = false;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        barcodeLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Function to validate if the scanned data is an ISBN
  const isISBN = (data: string): boolean => {
    const isbn10Pattern = /^(?:\d{9}X|\d{10})$/; // ISBN-10 pattern
    const isbn13Pattern = /^(978|979)\d{10}$/; // ISBN-13 pattern
    return isbn10Pattern.test(data) || isbn13Pattern.test(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />

      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </Link>

      <CameraView 
        facing="back" 
        style={styles.camera}
        onBarcodeScanned={({ data }) => {
          if (data && !barcodeLock.current) {
            barcodeLock.current = true;

            // Check if the scanned barcode is valid
            if (isISBN(data)) {
              setInvalidBarcode(false);
              setTimeout(async () => {
                isbn = data;
                console.log(isbn);
                setPopup(true)
                setScanning(false)
                // await Linking.openURL("http://openlibrary.org/isbn/" + data + ".json");
              }, 800);
            } else {
              // Invalid barcode (not an ISBN)
              setInvalidBarcode(true);
              barcodeLock.current = false;
            }
          }
        }}
      >
      </CameraView>

      {invalidBarcode && (
        <Text style={styles.errorMessage}>This is not a valid ISBN barcode.</Text>
      )}
      
      {scanning && <Overlay />}

      {popupVisible && <Popup onClose={handleErrorClick}/>} 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorMessage: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'red',
    padding: 10,
    color: 'white',
    fontSize: 18,
    borderRadius: 8,
    opacity: 0.8,
  },
});
