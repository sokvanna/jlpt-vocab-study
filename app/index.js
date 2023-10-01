import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import n3 from "../db/n3.json";
import { TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  let fontSize = 50;
  let paddingVertical = 1;

  const [vocabulary, setVocabulary] = useState([]);
  const [randomSelection, setRandomSelection] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const getRandomObjects = (arr, count) => {
    const selectedObjects = [];
    const copyOfArr = [...arr];

    if (count > arr.length) {
      throw new Error("Count should not exceed the length of the array");
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * copyOfArr.length);
      const randomObject = copyOfArr.splice(randomIndex, 1)[0];
      selectedObjects.push(randomObject);
    }

    return selectedObjects;
  };

  const handleRandomSelection = () => {
    const newRandomSelection = getRandomObjects(n3, 40);
    setRandomSelection(newRandomSelection);
    getAnswers(newRandomSelection);
  };

  const setInitialState = () => {
    const vocabWithScore = n3.map(function (ele) {
      return { ...ele, score: 0 };
    });
    storeData(vocabWithScore);
    setVocabulary(vocabWithScore);
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("n3Vocab", jsonValue);
    } catch (e) {
      console.log("error saving", e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("n3Vocab");
      if (jsonValue !== null) {
        setVocabulary(JSON.parse(jsonValue));
      } else {
        setInitialState();
      }
    } catch (e) {
      setInitialState();
      // error reading value
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      setInitialState();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };

  const onAnswer = (a) => {
    if (a.word === randomSelection[current].word) {
      console.log("CORRECT");
    } else {
      console.log("FALSE");
    }
  };
  const getRandomNumberExcluding = (min, max) => {
    let randomNumber;

    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomNumber === current);

    return randomNumber;
  };
  const getAnswers = (newRandomSelection) => {
    const randomNum1 = getRandomNumberExcluding(1, 40);
    const randomNum2 = getRandomNumberExcluding(1, 40);
    const randomNum3 = getRandomNumberExcluding(1, 40);

    const originalArray = [
      newRandomSelection[current],
      vocabulary[randomNum1],
      vocabulary[randomNum2],
      vocabulary[randomNum3],
    ];
    setAnswers(shuffleArray(originalArray));
  };

  const shuffleArray = (arr) => {
    const shuffledArray = [...arr]; // Create a copy of the original array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap elements at i and j
    }

    return shuffledArray; // Return the shuffled array
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {randomSelection.length && answers.length > 0 ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize,
              paddingVertical,
              fontFamily: "NotoSerifJP_500Medium",
            }}
          >
            {randomSelection[current].word}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {answers.map((a, index) => {
              return (
                <TouchableOpacity
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "45%",
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "#000",
                    borderRadius: 10,
                  }}
                  key={index}
                  onPress={() => onAnswer(a)}
                >
                  <Text>{a.romaji}</Text>
                  <Text>{a.furigana}</Text>

                  <Text
                    style={{
                      fontSize: 11,
                    }}
                  >
                    {a.meaning}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "rgb(43, 153, 216)",
          borderRadius: 10,
          width: 200,
          backgroundColor: "rgb(43, 153, 216)",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20,
          height: 50,
        }}
        onPress={handleRandomSelection}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
          }}
        >
          Shuffle
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={clearAll}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
