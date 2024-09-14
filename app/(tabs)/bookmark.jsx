import {
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { getBookmarkedVideos, searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { RefreshControl } from "react-native";


const Bookmarks = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getBookmarkedVideos(user.$id));
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  console.log(posts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-2xl font-psemibold text-smoke">Your saved videos</Text>
            <View className="mt-6 mb-8">
              <SearchInput placeholder={"Search your saved videos"} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found for this search"
            subtitle="Be the first to upload a video"
          />
        )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Bookmarks;
