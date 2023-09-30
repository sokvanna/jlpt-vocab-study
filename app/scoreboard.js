import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function Scoreboard() {
  const [vocabulary, setVocabulary] = useState([]);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("n3Vocab");
      if (jsonValue !== null) {
        setVocabulary(JSON.parse(jsonValue));
      }
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollView>
      {vocabulary.map((v, index) => {
        return (
          <Text key={index}>
            {v.word} {v.score}
          </Text>
        );
      })}
    </ScrollView>
  );
}
