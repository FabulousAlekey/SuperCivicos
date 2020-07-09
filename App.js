import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import Settings from './screens/settings';
import Home from './screens/home';
import Profile from './screens/profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home';
            } else if (route.name === 'Explorar') {
              iconName = focused ? 'ios-map' : 'ios-map';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name='Explorar' component={Settings} />
        <Tab.Screen name='Perfil' component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
