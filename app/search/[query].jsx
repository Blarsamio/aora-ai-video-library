import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { router, useLocalSearchParams } from "expo-router";
import { icons } from "../../constants";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  useEffect(() => {
    refetch();
  }, [query]);
  const handleBackPress = () => {
    router.back();
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-smoke-200">
              Search Results
            </Text>
            <TouchableOpacity
              className="w-full items-end mb-10 absolute right-4 top-0"
              onPress={handleBackPress}
            >
              <Image source={icons.logout} className="w-6 h-6" resizeMode="contain" />
            </TouchableOpacity>
            <Text className="text-2xl font-psemibold text-smoke">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found for this search"
            subtitle="Be the first to upload a video"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
