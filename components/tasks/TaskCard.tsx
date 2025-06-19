// components/TaskCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the interface for a Task object
interface Task {
  id: string;
  title: string;
  location: string;
  dateTime?: string; // Optional property
  completionDate?: string; // Optional property
  status?: string; // Optional property
  rating?: number; // Optional property
}

// Define the interface for TaskCard component's props
interface TaskCardProps {
  task: Task;
  // onAction is a function that takes an 'action' string and 'taskId' string, and returns void
  // Changed taskId to 'string' to match Task.id type
  onAction: (action: string, taskId: string) => void;
}

const TaskCard = ({ task, onAction }: TaskCardProps) => {
  const renderButtons = () => {
    switch (task.status) {
      case 'Available':
        return (
          <TouchableOpacity
            onPress={() => onAction('apply', task.id)}
            style={[styles.button, styles.applyButton]}
          >
            <Text style={styles.buttonText}>Apply to Volunteer</Text>
          </TouchableOpacity>
        );

      case 'In Progress':
        return (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => onAction('start', task.id)}
              style={[styles.button, styles.startButton]}
            >
              <Text style={styles.buttonText}>Start Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAction('markDone', task.id)}
              style={[styles.button, styles.markDoneButton]}
            >
              <Text style={styles.buttonText}>Mark as Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'Pending':
        return (
          <TouchableOpacity
            onPress={() => onAction('withdraw', task.id)}
            style={[styles.button, styles.withdrawButton]}
          >
            <Text style={styles.buttonText}>Withdraw Task</Text>
          </TouchableOpacity>
        );

      case 'Completed':
      case 'Cancelled':
      case 'Approved':
      case 'Rejected':
        return (
          <TouchableOpacity
            onPress={() => onAction('viewDetails', task.id)}
            style={[styles.button, styles.viewDetailsButton]}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };


  // Explicitly type the 'rating' parameter as 'number | undefined | null'
  const renderRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.starIcon, i <= rating ? styles.filledStar : styles.emptyStar]}>
          ★
        </Text>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{task.title}</Text>
      <Text style={styles.cardText}>Location: {task.location}</Text>
      {task.dateTime && <Text style={styles.cardText}>Date & Time: {task.dateTime}</Text>}
      {task.completionDate && <Text style={styles.cardText}>Completion Date: {task.completionDate}</Text>}
      {task.status && <Text style={styles.cardText}>Status: {task.status}</Text>}
      {renderRating(task.rating)}
      {renderButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#17A2B8', 
    padding: 10, // p-4
    marginBottom: 16, // mb-4
    borderRadius: 8, // rounded-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16, // text-lg
    fontWeight: 'bold',
    color: '#fff', // text-white
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14, // text-sm
    color: '#fff', // text-white
    marginBottom: 2,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5, // mt-2
  },
  starIcon: {
    fontSize: 23, // text-2xl
  },
  filledStar: {
    color: '#FACC15', // yellow-400
  },
  emptyStar: {
    color: '#d1d5db', // gray-300
  },
  button: {
    paddingVertical: 6, // py-2
    paddingHorizontal: 5, // px-6 (for apply/view details) or px-4 (for others)
    borderRadius: 25, // rounded-lg
    marginTop: 16, // mt-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // text-white
    fontWeight: 'bold',
    fontSize: 12,
  },
  applyButton: {
    backgroundColor: '#C6303E', // red-600
  },
  viewDetailsButton: {
    backgroundColor: '#C6303E', // red-600
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8, // mt-4
    justifyContent: 'space-between',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#C6303E', // blue-600
    flex: 1,
    marginRight: 4, // space-x-2 equivalent
  },
  markDoneButton: {
    backgroundColor: '#C6303E', // red-600
    flex: 1,
  },
  withdrawButton: {
    backgroundColor: '#C6303E', // blue-600
    flex: 1,
  },
});

export default TaskCard;
