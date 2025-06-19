// views/VolunteerNowScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/tasks/Header';
import SearchBar from '../../components/tasks/SearchBar';
import FilterDropdown from '../../components/tasks/FilterDropdown'; // Simplified for RN
import SidebarMenu from '../../components/tasks/SidebarMenu'; // Simplified for RN
import TaskCard from '../../components/tasks/TaskCard'; // Simplified for RN
import type { StackNavigationProp } from '@react-navigation/stack';

interface TaskListProps {
  onAction: (action: string, taskId: string | number) => void;
}

// Dynamic Task List Components
const AvailableTasksList = ({ onAction }: TaskListProps) => {
  const tasks = [
    { id: '1', title: 'Food Distribution', location: 'Brgy. Luz, Cebu', dateTime: '02/20/25 | 10:00A.M', status: 'Available' },
    { id: '2', title: 'Community Clean-up', location: 'Poblacion, Sipalay', dateTime: '03/01/25 | 09:00A.M', status: 'Available' },
  ];
  return (
    <ScrollView style={styles.taskListContainer}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onAction={onAction} />
      ))}
    </ScrollView>
  );
};

const MyTasksList = ({ onAction }: TaskListProps) => {
  const tasks = [
    { id: '1', title: 'Food Distribution', location: 'Brgy. Luz, Cebu', status: 'In Progress' },
    { id: '2', title: 'Clean Up Drive', location: 'Brgy. Luz, Cebu', status: 'Completed' },
    { id: '3', title: 'Clean Up Drive', location: 'Brgy. Luz, Cebu', status: 'Cancelled' },
  ];
  return (
    <ScrollView style={styles.taskListContainer}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onAction={onAction} />
      ))}
    </ScrollView>
  );
};

const SubmittedTasksList = ({ onAction }: TaskListProps) => {
  const tasks = [
    { id: '1', title: 'Health Awareness Campaign', location: 'Brgy. Luz, Cebu', status: 'Approved' },
    { id: '2', title: 'Health Awareness Campaign', location: 'Brgy. Luz, Cebu', status: 'Pending' },
    { id: '3', title: 'Health Awareness Campaign', location: 'Brgy. Luz, Cebu', status: 'Rejected' },
  ];
  return (
    <ScrollView style={styles.taskListContainer}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onAction={onAction} />
      ))}
    </ScrollView>
  );
};

const CompletedTasksList = ({ onAction }: TaskListProps) => {
  const tasks = [
    { id: '1', title: 'Food Distribution', location: 'Brgy. Luz, Cebu', completionDate: '02/20/25', rating: 4, status: 'Completed' },
    { id: '2', title: 'Health Awareness', location: 'Brgy. Luz, Cebu', completionDate: '02/20/25', rating: 3, status: 'Completed' },
  ];
  return (
    <ScrollView style={styles.taskListContainer}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onAction={onAction} />
      ))}
    </ScrollView>
  );
};



type RootStackParamList = {
  HomeScreen: undefined;
  // Add other screens here if needed
};

const VolunteerNowScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('Available Tasks'); // Default active tab

  const handleAction = (action: string, taskId: string | number) => {
    console.log(`${action} task: ${taskId} from ${activeTab} screen`);
    // In a real app, this would trigger navigation or data update
  };

  const renderActiveTaskList = () => {
    switch (activeTab) {
      case 'Available Tasks':
        return <AvailableTasksList onAction={handleAction} />;
      case 'My Tasks':
        return <MyTasksList onAction={handleAction} />;
      case 'Submitted Tasks':
        return <SubmittedTasksList onAction={handleAction} />;
      case 'Completed Tasks':
        return <CompletedTasksList onAction={handleAction} />;
      default:
        return <AvailableTasksList onAction={handleAction} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
    <Header
    title="Volunteer Tasks"
    onProfilePress={() => navigation.navigate('HomeScreen')}
    onSearch={(text) => console.log(text)}
  />


    <View style={styles.bodyWrapper}>
      <View style={styles.filterContainer}>
        <FilterDropdown label="Location" options={[{ label: 'Any', value: 'any' }, { label: 'Cebu', value: 'cebu' }]} />
        <View style={styles.spacer} />
        <FilterDropdown label="Type of Task" options={[{ label: 'Any', value: 'any' }, { label: 'Food', value: 'food' }, { label: 'Health', value: 'health' }]} />
      </View>

      <View style={styles.divider} />

      <View style={styles.contentArea}>
        <SidebarMenu activeItem={activeTab} onItemPress={setActiveTab} />
        {renderActiveTaskList()}
      </View>
    </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    bodyWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  screenContainer: {
    flex: 1,
    borderRadius: 16, // Equivalent to rounded-lg
    overflow: 'hidden',
    backgroundColor: '#1E78AD',
    marginHorizontal: 16, // Equivalent to mx-4
    marginVertical: 20, // Some vertical margin for the whole app container
    elevation: 8, // Equivalent to shadow-lg for Android
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16, // Equivalent to p-4
    justifyContent: 'space-between',
  },
    divider: {
    height: 1,
    backgroundColor: '#BEBEBE',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  spacer: {
    width: 16, // Equivalent to space-x-4
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  taskListContainer: {
    flex: 1,
    padding: 10, // Equivalent to p-4
  },
});

export default VolunteerNowScreen;
