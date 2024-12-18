import {Tabs, Stack} from "expo-router";
import {Home, BookMarked, User} from "lucide-react-native";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#0891b2",
          tabBarInactiveTintColor: "#64748b",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({color}) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Bookings",
            tabBarIcon: ({color}) => <BookMarked size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({color}) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
