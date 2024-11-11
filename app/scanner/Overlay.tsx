import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Set custom dimensions for the barcode area
const innerWidth = 350;  // Wider width for a barcode
const innerHeight = 100; // Shorter height for a barcode

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerWidth / 2,   // Center the inner rectangle horizontally
    height / 2 - innerHeight / 2, // Center the inner rectangle vertically
    innerWidth,
    innerHeight
  ),
  20,  // Border radius for rounded corners (adjust as needed)
  20
);

export const Overlay = () => {
  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
    </Canvas>
  );
};
