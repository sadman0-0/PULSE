import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductGrid'>;

// Extended mock array to demonstrate grid scrolling
const ALL_PRODUCTS = [
    { id: '1', name: 'Premium Dog Food', price: 120, image: 'https://images.unsplash.com/photo-1589723930437-53c229f0bf87?auto=format&fit=crop&q=80&w=200', badge: 'Popular' },
    { id: '2', name: 'Chicken Treats', price: 80, image: 'https://images.unsplash.com/photo-1608454367599-c11394f09204?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Chew Bone', price: 60, image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1bf0?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'Meat Sticks', price: 90, image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=200' },
    { id: '5', name: 'Organic Kibble', price: 140, image: 'https://images.unsplash.com/photo-1589723930437-53c229f0bf87?auto=format&fit=crop&q=80&w=200' },
    { id: '6', name: 'Salmon Jerky', price: 110, image: 'https://images.unsplash.com/photo-1608454367599-c11394f09204?auto=format&fit=crop&q=80&w=200' },
];

export default function ProductGridScreen({ route, navigation }: Props) {
    const { title } = route.params;

    return (
        <SafeAreaView className="flex-1 bg-[#F9FBFA]">

            {/* Dynamic Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#EDF1EF] bg-white">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 bg-[#F4F7F5] rounded-full"
                >
                    <Feather name="arrow-left" size={20} color="#2A4232" />
                </TouchableOpacity>

                <Text className="text-lg font-extrabold text-[#112415]">{title}</Text>

                {/* Placeholder element to balance header centering alignment */}
                <View className="w-9 h-9" />
            </View>

            {/* 2-Column Responsive Product Grid */}
            <FlatList
                data={ALL_PRODUCTS}
                numColumns={2}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View className="bg-white w-[47%] rounded-[24px] border border-[#ECECEC] p-3 mb-4 relative shadow-xs">
                        {item.badge && (
                            <View className="absolute top-2 left-2 bg-[#F3FAF5] border border-[#D9ECD9] px-2 py-0.5 rounded-full z-10">
                                <Text className="text-[9px] font-bold text-[#216C3F]">{item.badge}</Text>
                            </View>
                        )}

                        <View className="items-center justify-center h-28 my-2">
                            <Image
                                source={{ uri: item.image }}
                                className="w-24 h-24 rounded-2xl"
                                resizeMode="cover"
                            />
                        </View>

                        <Text className="text-xs font-bold text-[#112415] mb-2 h-8" numberOfLines={2}>
                            {item.name}
                        </Text>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <FontAwesome5 name="coins" size={11} color="#FFB03A" />
                                <Text className="ml-1 text-xs font-black text-[#112415]">{item.price}</Text>
                            </View>

                            <TouchableOpacity className="bg-[#216C3F] w-7 h-7 rounded-full items-center justify-center">
                                <Feather name="plus" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}