import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopScreen from './ShopScreen';
import ProductGridScreen from './ProductGridScreen';

export type RootStackParamList = {
    ShopHome: undefined;
    ProductGrid: { title: string; categoryId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ShopHome" component={ShopScreen} />
                <Stack.Screen name="ProductGrid" component={ProductGridScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}