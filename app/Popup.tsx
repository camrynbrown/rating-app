import { Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { isbn } from "./scanner/index";  // Assuming 'isbn' is the ISBN you want to look up
import { Link } from "expo-router";

export default function Popup({ onClose }: { onClose: () => void }) {
  const [bookTitle, setBookTitle] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch book data from Open Library API
        const response = await fetch(`https://openlibrary.org/api/volumes/brief/isbn/${isbn}.json`);
        const data = await response.json();

        // Extract title and author from Open Library API
        const title = data.records[Object.keys(data.records)[0]]?.data?.title;
        const authorName = data.records[Object.keys(data.records)[0]]?.data?.authors[0]?.name;

        if (title) setBookTitle(title);
        if (authorName) setAuthor(authorName);

        // Fetch book cover image from Google Books API using the title and author
        if (title && authorName) {
          const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${authorName}`;
          const googleResponse = await fetch(googleBooksApiUrl);
          const googleData = await googleResponse.json();

          // Extract cover image URL from the Google Books API response
          if (googleData.items && googleData.items.length > 0) {
            const coverUrl = googleData.items[0].volumeInfo.imageLinks?.thumbnail;
            if (coverUrl) setCoverImage(coverUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, []);  // This effect runs once when the component is mounted

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>Is this the scanned book?</Text>

        {/* Display the book cover if available */}
        {coverImage && (
          <Image
            style={styles.cover}
            source={{ uri: coverImage }}
          />
        )}

        {/* Display the book title and author */}
        <Text style={styles.bookDetails}>
          {bookTitle ? `${bookTitle} by ${author}` : "Loading..."}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onClose}>
            <Image style={styles.error} source={require("../assets/images/error.png")} />
          </TouchableOpacity>
          <Link href="/Information" asChild>
            <Pressable>
                <Image style={styles.correct} source={require('../assets/images/yes.png')} />
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    width: "80%",
    height: "50%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cover: {
    width: 120,  // Set the width of the cover image
    height: 180,  // Set the height of the cover image
    marginBottom: 20,  // Space between the cover and the title/author
    resizeMode: "contain",  // Ensures the image scales proportionally
  },
  bookDetails: {
    fontSize: 20,
    textAlign: 'center',
    color: "#555",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "auto",
  },
  error: {
    width: 50,
    height: 50,
  },
  correct: {
    width: 50,
    height: 50,
  },
});
