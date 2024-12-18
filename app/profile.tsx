import {View, Text, Image, ScrollView} from "react-native";
import {useQuery} from "@tanstack/react-query";
import tw from "twrnc";
import React from "react";

const fetchUserProfile = async () => {
  const response = await fetch("http://172.16.17.52:3000/users/user123");
  return response.json();
};

export default function Profile() {
  const {data: user, isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserProfile,
  });

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-white p-6 items-center`}>
        <Image
          source={{uri: user?.avatar}}
          style={tw`w-24 h-24 rounded-full`}
        />
        <Text style={tw`text-xl font-bold mt-4`}>{user?.name}</Text>
        <Text style={tw`text-gray-600`}>{user?.email}</Text>
      </View>
      <ScrollView>
        <View style={tw`mt-6 mx-4`}>
          <View style={tw`bg-white rounded-lg p-4 mb-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Account Settings</Text>
            <Text style={tw`text-gray-600 py-2 border-b border-gray-200`}>
              Edit Profile
            </Text>
            <Text style={tw`text-gray-600 py-2 border-b border-gray-200`}>
              Change Password
            </Text>
            <Text style={tw`text-gray-600 py-2 border-b border-gray-200`}>
              Notifications
            </Text>
            <Text style={tw`text-gray-600 py-2`}>Payment Methods</Text>
          </View>

          <View style={tw`bg-white rounded-lg p-4 mb-4`}>
            <Text style={tw`text-lg font-bold mb-2`}>Support</Text>
            <Text style={tw`text-gray-600 py-2 border-b border-gray-200`}>
              Help Center
            </Text>
            <Text style={tw`text-gray-600 py-2 border-b border-gray-200`}>
              Contact Us
            </Text>
            <Text style={tw`text-gray-600 py-2`}>Terms & Privacy</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
