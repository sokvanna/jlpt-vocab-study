import { StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import n3 from "../db/n3.json";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

export default function App() {
  let fontSize = 50;
  let paddingVertical = 1;

  const [vocabulary, setVocabulary] = useState([]);
  const [randomSelection, setRandomSelection] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(undefined);

  const setInitialState = () => {
    const vocabWithScore = n3.map(function (ele) {
      return { ...ele, score: 0 };
    });
    storeData(vocabWithScore);
    setVocabulary(vocabWithScore);
    setIsCorrect(undefined);
    setAnswers([]);
    setCurrent(0);
    setRandomSelection([]);
  };

  const getRandomObjects = (arr, count) => {
    const selectedObjects = [];
    const copyOfArr = [...arr];

    if (count > arr.length) {
      console.log("Count should not exceed the length of the array");
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * copyOfArr.length);
      const randomObject = copyOfArr.splice(randomIndex, 1)[0];
      selectedObjects.push(randomObject);
    }

    return selectedObjects;
  };

  const getCombo = (arr) => {
    const copyArry = [...arr];
    const max = 40;
    const diff = max - arr.length;
    for (let i = 0; i < diff; i++) {
      const randomIndex = Math.floor(Math.random() * vocabulary.length);
      copyArry.concat(vocabulary[randomIndex]);
    }
    return copyArry;
  };

  const handleRandomSelection = () => {
    const wordArr =
      vocabulary.filter((w) => w.score < 50).length >= 40
        ? vocabulary.filter((w) => w.score < 50)
        : getCombo(vocabulary.filter((w) => w.score < 50));
    const newRandomSelection = getRandomObjects(wordArr, 40);
    const currentAnswer = newRandomSelection[0];
    setIsCorrect(undefined);
    setCurrent(0);
    setRandomSelection(newRandomSelection);
    getAnswers(currentAnswer);
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
      setIsCorrect(true);
      const vocabArry = [...vocabulary];
      const index = vocabulary.findIndex((v) => v.word === a.word);
      vocabArry[index].score =
        Number(vocabArry[index].score) === 50
          ? Number(vocabArry[index].score)
          : Number(vocabArry[index].score) + 1;

      setVocabulary(vocabArry);
      storeData(vocabArry);
    } else {
      setIsCorrect(false);
      const vocabArry = [...vocabulary];
      const index = vocabulary.findIndex((v) => v.word === a.word);

      vocabArry[index].score =
        Number(vocabArry[index].score) === 0
          ? Number(vocabArry[index].score)
          : Number(vocabArry[index].score) - 1;
      setVocabulary(vocabArry);
      storeData(vocabArry);
    }
    let nextCurrent = current + 1;
    if (nextCurrent < 40) {
      setTimeout(() => {
        setIsCorrect(undefined);
        getAnswers(randomSelection[nextCurrent]);
        setCurrent(nextCurrent);
      }, 1500);
    } else {
      Alert.alert("Finished", "Reshuffle to play again", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => handleRandomSelection() },
      ]);
    }
  };
  const getRandomNumberExcluding = (min, max) => {
    let randomNumber;

    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomNumber === current);

    return randomNumber;
  };
  const getAnswers = (currentAnswer) => {
    const randomNum1 = getRandomNumberExcluding(0, 39);
    const randomNum2 = getRandomNumberExcluding(0, 39);
    const randomNum3 = getRandomNumberExcluding(0, 39);

    const originalArray = [
      currentAnswer,
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

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    getData();
    onFetchUpdateAsync();
  }, []);

  return (
    <View style={styles.container}>
      {randomSelection.length && answers.length > 0 && current <= 39 ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isCorrect === false ? (
            <Text
              style={{
                color: "red",
                fontSize: 18,
                position: "relative",
                top: 20,
              }}
            >
              {randomSelection[current].romaji}
            </Text>
          ) : null}
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
                    height: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor:
                      isCorrect && a.word === randomSelection[current].word
                        ? "#29CD9C"
                        : "#dbdbdb",
                    borderRadius: 10,
                  }}
                  key={index}
                  onPress={() => onAnswer(a)}
                >
                  {isCorrect && a.word === randomSelection[current].word ? (
                    <FontAwesome
                      size={14}
                      name="check-circle"
                      color="#29CD9C"
                    />
                  ) : null}
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

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Reset & Delete All Scores", "Are you sure?", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => clearAll() },
          ])
        }
      >
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
