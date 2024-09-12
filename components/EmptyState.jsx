import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants/";
import { router } from "expo-router";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center font-psemibold text-smoke">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-smoke-200 mt-2">
        {subtitle}
      </Text>
      <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyle="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
