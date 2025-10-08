import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultApp from '../app/DefaultApp';
import { RootStackParamList } from '../types/navigation';
import PlayerScreen from '../components/screens/PlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DefaultApp} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}
