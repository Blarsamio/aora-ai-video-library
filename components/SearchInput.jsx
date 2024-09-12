import { View, Text, TextInput, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="flex flex-row w-full h-16 px-4 bg-onix-100 rounded-lg focus:border-2 focus:border-secondary items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-smoke flex-1 font-pregular"
        value={value}
        placeholder="Search for a video topic"
        placeholderTextColor="#CCCCCC"
        onChangeText={handleChangeText}
      />
      <Pressable>
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </Pressable>

    </View>
  );
};

export default SearchInput;
