import { CameraView, useCameraPermissions } from "expo-camera";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function Home() {
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
       />
      <CameraView 
      facing="back" 
      style={styles.camera}
      onBarcodeScanned={({ data }) => {
        console.log("data", data);
      }}>
        
      </CameraView>
    </SafeAreaView>
  )
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
});