import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {Link, router} from "expo-router";
import tw from "twrnc";
import {useState} from "react";
import {Search} from "lucide-react-native";
import React from "react";
import axios from "axios";

const fetchProperties = async () => {
  const response = await axios.get("http://172.16.17.52:3000/properties");
  return response.data;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: properties,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const filteredProperties = properties?.filter(
    (property: {title: string; description: string}) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4 bg-white shadow-sm`}>
        <View
          style={tw`flex-row items-center bg-gray-100 rounded-lg px-4 py-2`}
        >
          <Search size={20} color="#64748b" />
          <TextInput
            style={tw`flex-1 ml-2`}
            placeholder="Search properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={tw`bg-white m-4 rounded-lg shadow-sm overflow-hidden`}
            onPress={() => router.push(`/property/${item.id}`)}
          >
            <Image
              source={{uri: item.images[0]}}
              style={tw`w-full h-48`}
              resizeMode="cover"
            />
            <View style={tw`p-4`}>
              <Text style={tw`text-xl font-bold`}>{item.title}</Text>
              <Text style={tw`text-gray-600 mt-1`}>{item.description}</Text>
              <Text style={tw`text-cyan-600 font-bold mt-2`}>
                ${item.price}/night
              </Text>
              <Text style={tw`text-gray-500 mt-1`}>
                {item.location.address}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
