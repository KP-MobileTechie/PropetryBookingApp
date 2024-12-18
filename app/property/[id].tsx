import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {useLocalSearchParams, useRouter} from "expo-router";
import MapView, {Marker} from "react-native-maps";
import tw from "twrnc";
import React, {useState} from "react";

const fetchProperty = async (id: string) => {
  const response = await fetch(`http://172.16.17.52:3000/properties/${id}`);
  return response.json();
};

const bookProperty = async (bookingDetails: any) => {
  const response = await fetch("http://172.16.17.52:3000/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingDetails),
  });
  return response.json();
};

export default function PropertyDetails() {
  const {id} = useLocalSearchParams();
  const {data: property, isLoading} = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id as string),
  });
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setStatusMessage("Please select both check-in and check-out dates.");
      return;
    }

    const bookingDetails = {
      propertyId: id,
      checkIn,
      checkOut,
      totalPrice:
        (property.price *
          (new Date(checkOut).getTime() - new Date(checkIn).getTime())) /
        (1000 * 3600 * 24),
      status: "Confirmed",
    };

    try {
      const booking = await bookProperty(bookingDetails);
      setStatusMessage("Booking successful!");
      setTimeout(() => {
        router.push("/bookings"); // Navigate to bookings page
      }, 2000);
    } catch (error) {
      setStatusMessage("Booking failed. Please try again.");
    }
  };

  if (isLoading || !property) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <Image
        source={{uri: property.images[0]}}
        style={tw`w-full h-64`}
        resizeMode="cover"
      />
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold`}>{property.title}</Text>
        <Text style={tw`text-gray-600 mt-2}`}>{property.description}</Text>
        <Text style={tw`text-cyan-600 text-xl font-bold mt-2`}>
          ${property.price}/night
        </Text>

        <Text style={tw`text-lg font-bold mt-4 mb-2`}>Booking Details</Text>

        {/* Check-In and Check-Out Date Inputs */}
        <TextInput
          style={tw`border p-2 mb-2 rounded`}
          placeholder="Check-in Date"
          value={checkIn}
          onChangeText={setCheckIn}
          keyboardType="default"
        />
        <TextInput
          style={tw`border p-2 mb-4 rounded`}
          placeholder="Check-out Date"
          value={checkOut}
          onChangeText={setCheckOut}
          keyboardType="default"
        />

        {/* Booking Status Message */}
        {statusMessage && (
          <Text style={tw`text-red-500 mt-2`}>{statusMessage}</Text>
        )}

        <TouchableOpacity
          style={tw`bg-cyan-600 rounded-lg py-4 mt-6`}
          onPress={handleBooking}
        >
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Book Now
          </Text>
        </TouchableOpacity>

        {/* Map for the Property Location */}
        <Text style={tw`text-lg font-bold mt-4 mb-2`}>Location</Text>
        <MapView
          style={tw`w-full h-48 rounded-lg`}
          initialRegion={{
            latitude: property.location.latitude,
            longitude: property.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: property.location.latitude,
              longitude: property.location.longitude,
            }}
            title={property.title}
          />
        </MapView>
      </View>
    </ScrollView>
  );
}
