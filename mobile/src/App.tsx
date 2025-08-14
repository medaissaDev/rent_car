import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CarDetailsScreen from './screens/CarDetailsScreen';
import AddCarScreen from './screens/company/AddCarScreen';
import ChatScreen from './screens/chat/ChatScreen';
import ConversationsScreen from './screens/chat/ConversationsScreen';
import BookingScreen from './screens/BookingScreen';
import { AuthProvider, useAuth } from './providers/AuthProvider';

const Stack = createNativeStackNavigator();

function AppNavigator() {
	const { user } = useAuth();
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{!user ? (
					<>
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</>
				) : (
					<>
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="CarDetails" component={CarDetailsScreen} />
						<Stack.Screen name="AddCar" component={AddCarScreen} />
						<Stack.Screen name="Booking" component={BookingScreen} />
						<Stack.Screen name="Conversations" component={ConversationsScreen} />
						<Stack.Screen name="Chat" component={ChatScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<NativeBaseProvider>
			<AuthProvider>
				<AppNavigator />
			</AuthProvider>
		</NativeBaseProvider>
	);
}