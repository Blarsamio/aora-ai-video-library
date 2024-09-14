import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: "",
    thumbnail: "",
    prompt: "",
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpeg", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if ( form.prompt === "" || form.title === "" || !form.video || !form.thumbnail) {
      return Alert.alert("Error", "Please fill all the fields");
    }
    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Video uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: "",
        thumbnail: "",
        prompt: "",
      });
      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-smoke font-psemibold">
          Upload a video
        </Text>
        <FormField
          title="Video title"
          value={form.title}
          placeholder="Give your video a catchy title"
          handleChangeText={(text) => setForm({ ...form, title: text })}
          otherStyles="mt-10"
        ></FormField>
        <View className="mt-7 space-y-2 ">
          <Text className="text-base text-smoke-200 font-pmedium">
            Upload video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-onix-100/50 justify-center items-center rounded-2xl">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center rounded-lg">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  ></Image>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-smoke-200 font-pmedium">
            Thumbnail image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-onix-100/50 justify-center items-center rounded-2xl flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                ></Image>
                <Text className="text-sm text-smoke-200 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(text) => setForm({ ...form, prompt: text })}
          otherStyles="mt-7"
        ></FormField>
        <CustomButton
          title="Upload"
          handlePress={submit}
          isLoading={uploading}
          onPress={() => setUploading(true)}
          containerStyle="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
