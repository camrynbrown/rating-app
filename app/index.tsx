import { useCameraPermissions } from "expo-camera";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView>
      <Pressable onPress={requestPermission}>
        <Text>Request Permissions</Text>
      </Pressable>

      <Link href="/scanner" asChild>
        <Pressable disabled={!isPermissionGranted}>
          <Text style={[{ opacity: !isPermissionGranted ? 0.5 : 1 }]}>
            Scan Code
          </Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
});
