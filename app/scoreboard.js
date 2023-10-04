import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";

export default function Scoreboard() {
  const [vocabulary, setVocabulary] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("n3Vocab");
      if (jsonValue !== null) {
        setVocabulary(JSON.parse(jsonValue));
        setRefreshing(false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setRefreshing(true);
    getData();
  }, []);

  const Item = ({ word, score }) => (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#dbdbdb",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: "NotoSerifJP_500Medium",
        }}
      >
        {word}
      </Text>
      <Text>{score} / 50</Text>
    </View>
  );

  return (
    <View>
      <Text
        style={{
          padding: 10,
          fontWeight: 500,
          backgroundColor: "#006adc",
          color: "#fff",
        }}
      >
        Completed: ({vocabulary.filter((w) => w.score === 50).length} /{" "}
        {vocabulary.length})
      </Text>
      <FlatList
        onRefresh={() => getData()}
        data={vocabulary.sort((a, b) => b.score - a.score)}
        renderItem={({ item }) => <Item word={item.word} score={item.score} />}
        keyExtractor={(item) => item.word}
        refreshing={isRefreshing}
      />
    </View>
  );
}
