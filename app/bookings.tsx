import {View, Text, FlatList, Image} from "react-native";
import {useQuery} from "@tanstack/react-query";
import tw from "twrnc";
import React from "react";

const fetchBookings = async () => {
  const response = await fetch("http://172.16.17.52:3000/bookings");
  const bookings = await response.json();
  console.log("Bookings fetched:", bookings);

  const bookingsWithDetails = await Promise.all(
    bookings.map(
      async (booking: {
        propertyId: any;
        checkIn: string;
        checkOut: string;
        totalPrice: number;
      }) => {
        const propertyResponse = await fetch(
          `http://172.16.17.52:3000/properties/${booking.propertyId}`
        );
        const property = await propertyResponse.json();

        return {
          ...booking,
          property,
        };
      }
    )
  );

  return bookingsWithDetails;
};

export default function Bookings() {
  const {data: bookings, isLoading} = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
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
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={tw`bg-white m-4 rounded-lg shadow-sm overflow-hidden`}>
            <Image
              source={{uri: item.property.images[0]}}
              style={tw`w-full h-32`}
              resizeMode="cover"
            />
            <View style={tw`p-4`}>
              <Text style={tw`text-xl font-bold`}>{item.property.title}</Text>

              <Text style={tw`text-gray-600 mt-1`}>
                Check-in: {new Date(item.checkIn).toLocaleDateString()}
              </Text>
              <Text style={tw`text-gray-600`}>
                Check-out: {new Date(item.checkOut).toLocaleDateString()}
              </Text>

              <Text style={tw`text-cyan-600 font-bold mt-2`}>
                Total: ${item.totalPrice}
              </Text>

              <View style={tw`mt-2`}>
                <Text
                  style={tw`text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full self-start`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
