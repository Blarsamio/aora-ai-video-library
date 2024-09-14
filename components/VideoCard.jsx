import {
  View,
  Text,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { createBookmark } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [playing, setPlaying] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user } = useGlobalContext();

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBookmarkPress = () => {
    try {
      createBookmark(user.$id, $id);
      setMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOutsidePress = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            <View className="flex justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="font-psemibold text-sm text-smoke"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-xs text-smoke-200 font-pregular"
                numberOfLines={1}
              >
                {username}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleMenuOpen}>
            <View className="pt-2">
              <Image
                source={icons.menu}
                className="w-4 h-4"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </View>
        {playing ? (
          <Video
            source={{ uri: video }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlaying(false);
              }
            }}
          />
        ) : (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            activeOpacity={0.75}
            onPress={() => setPlaying(true)}
          >
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full mt-3 rounded-xl"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {menuOpen && (
          <View className="absolute -top-6 right-4 mt-16 w-32 h-20 bg-neutral-700 rounded-lg shadow-lg">
            <Pressable
              className="flex flex-row items-center px-4 justify-around space-x-2 w-full h-1/2"
              onPress={handleBookmarkPress}
            >
              <Image
                source={icons.bookmark}
                className="w-3 h-3"
                resizeMode="contain"
              ></Image>
              <Text className="text-sm font-psemibold text-smoke-200">
                Bookmark
              </Text>
            </Pressable>
            <Pressable
              className="flex flex-row items-center pl-2 px-4 justify-start space-x-2 w-full h-1/2"
              onPress={() => {
                console.log("Report");
              }}
            >
              <Image
                source={icons.search}
                className="w-3 h-3"
                resizeMode="contain"
              ></Image>
              <Text className="text-sm font-psemibold text-smoke-200">
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VideoCard;
