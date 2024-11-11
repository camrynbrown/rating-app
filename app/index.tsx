import { useCameraPermissions } from "expo-camera";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={50} style={StyleSheet.absoluteFill}>
        <View style={styles.overlay}>
          {isPermissionGranted ? (
            <Link href="/scanner" asChild>
              <Pressable style={styles.startButton}>
                <Text style={styles.startText}>Start Scanning!</Text>
              </Pressable>
            </Link>
          ) : (
            <>
              <Text style={styles.permissionText}>No Camera Permissions</Text>
              <Pressable style={styles.requestButton} onPress={requestPermission}>
                <Text style={styles.requestText}>Request Permissions</Text>
              </Pressable>
            </>
          )}
        </View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "blue",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
  },
  startText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  permissionText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: "grey",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  requestText: {
    color: "white",
    fontSize: 16,
  },
});
