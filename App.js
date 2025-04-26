import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ObjectsScreen from './screens/ObjectsScreen';

// Экраны


function RegistryScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params?.title || 'Реестр'}</Text>
    </View>
  );
}

function WidgetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Виджеты</Text>
    </View>
  );
}

function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавить</Text>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Уведомления</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ObjectsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ObjectsMain"
        component={ObjectsScreen}
        options={({ navigation }) => ({
          title: 'Объекты',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 15 }}>
              <Ionicons name="menu" size={28} color="#2566E8" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Registry"
        component={RegistryScreen}
        options={({ route, navigation }) => ({
          title: route.params?.title || 'Реестр',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 15 }}>
              <Ionicons name="menu" size={28} color="#2566E8" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2566E8',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
        },
        tabBarIcon: ({ color }) => {
          let iconName = 'home-outline';
          switch (route.name) {
            case 'Объекты': iconName = 'business-outline'; break;
            case 'Виджеты': iconName = 'bar-chart-outline'; break;
            case 'Добавить': iconName = 'add-circle-outline'; break;
            case 'Уведомления': iconName = 'notifications-outline'; break;
            case 'Профиль': iconName = 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Объекты"
        component={ObjectsStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'ObjectsMain';

          return {
            tabBarActiveTintColor: routeName === 'ObjectsMain' ? '#2566E8' : 'gray',
          };
        }}
      />
      <Tab.Screen name="Виджеты" component={WidgetsScreen} />
      <Tab.Screen name="Добавить" component={AddScreen} />
      <Tab.Screen name="Уведомления" component={NotificationsScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


function DrawerContent({ navigation }) {
  const registries = [
    { title: 'Нарушения', icon: 'alert-circle-outline' },
    { title: 'Документы', icon: 'document-outline' },
    { title: 'События', icon: 'calendar-outline' },
    { title: 'Проверки', icon: 'clipboard-outline' },
    { title: 'Внешние документы', icon: 'folder-outline' },
    { title: 'Документы чек-листов', icon: 'checkmark-done-outline' },
    { title: 'Проверки ГСН', icon: 'shield-outline' },
    { title: 'Контракты', icon: 'briefcase-outline' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.closeDrawer()}
          style={{
            alignSelf: 'flex-end',
            padding: 8,
            borderRadius: 12,
            backgroundColor: '#F0F0F0',
          }}
        >
          <Ionicons name="close" size={28} color="#2566E8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {registries.map((reg) => (
          <TouchableOpacity
            key={reg.title}
            style={styles.drawerButton}
            onPress={() => {
              navigation.navigate('MainTabs', {
                screen: 'Объекты',
                params: {
                  screen: 'Registry',
                  params: { title: reg.title },
                },
              });
              navigation.closeDrawer();
            }}
          >
            <Ionicons name={reg.icon} size={22} color="#2566E8" style={{ marginRight: 10 }} />
            <Text style={styles.drawerButtonText}>{reg.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="MainTabs" component={MainTabs} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2566E8',
  },
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    elevation: 2,
  },
  drawerButtonText: {
    fontSize: 18,
    color: '#2566E8',
    fontWeight: '500',
  },
});