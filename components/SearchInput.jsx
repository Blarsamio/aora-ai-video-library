import { View, Text, TextInput, Image, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";
import { TouchableOpacity } from "react-native";

const SearchInput = ({ initialQuery, placeholder }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View className="flex flex-row w-full h-16 px-4 bg-onix-100/50 rounded-lg focus:border-2 focus:border-secondary items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-smoke flex-1 font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CCCCCC"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if(!query) {
            return Alert.alert("Missing Query", "Please input something to search results across database")
          }

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }
      }
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity >

    </View>
  );
};

export default SearchInput;
