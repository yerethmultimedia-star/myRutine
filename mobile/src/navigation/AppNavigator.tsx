import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/DashboardScreen';
import RoutinesScreen from '../screens/routines/RoutinesScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoutineDetailScreen from '../screens/routines/RoutineDetailScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import CreateRoutineScreen from '../screens/routines/CreateRoutineScreen';
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';

export type RootTabParamList = {
  Dashboard: undefined;
  Routines: undefined;
  Tasks: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  RoutineDetail: { routineId: string };
  TaskDetail: { taskId: string };
  CreateRoutine: undefined;
  CreateTask: { routineId: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Routines') {
            iconName = 'list';
          } else if (route.name === 'Tasks') {
            iconName = 'assignment';
          } else {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Routines" component={RoutinesScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
