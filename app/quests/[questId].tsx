// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useQuestStore } from '../../src/state/questStore';
// import type { ChecklistItem } from '../../src/constants/quests/types';

// // Reusable Checklist Item Component (this can be moved to src/components later)
// const ChecklistItemComponent = ({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) => (
//   <TouchableOpacity style={styles.itemContainer} onPress={onToggle}>
//     <Ionicons
//       name={item.completed ? 'checkbox' : 'square-outline'}
//       size={24}
//       color={item.completed ? '#27ae60' : '#bdc3c7'}
//     />
//     <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
//       {item.text}
//     </Text>
//   </TouchableOpacity>
// );

// export default function QuestDetailScreen(): React.JSX.Element {
//   const router = useRouter();
//   const { questId } = useLocalSearchParams<{ questId: string }>(); // Get the questId from the URL

//   // Get state and actions from the store
//   const quests = useQuestStore(state => state.quests);
//   const isLoading = useQuestStore(state => state.isLoading);
//   const toggleItemCompleted = useQuestStore(state => state.toggleItemCompleted);
//   const getQuestProgress = useQuestStore(state => state.getQuestProgress);

//   // Find the specific quest to display based on the questId from the URL
//   const quest = quests.find(q => q.id === questId);
//   const progress = questId ? getQuestProgress(questId) : 0;

//   // Handle loading and error states
//   if (isLoading) {
//     return <ActivityIndicator style={{ flex: 1 }} />;
//   }

//   console.log("questId from URL:", questId);
//   console.log("quests in store:", quests.map(q => q.id));
  
//   if (!quest) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <Text>Error: Quest not found.</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Stack.Screen 
//         options={{ 
//           headerTitle: quest.title, // Set the header title dynamically
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
//               <Ionicons name="chevron-back" size={28} color="#007AFF" />
//             </TouchableOpacity>
//           ),
//         }} 
//       />
//       <FlatList
//         data={quest.categories}
//         keyExtractor={(category) => category.title}
//         renderItem={({ item: category }) => (
//           <View style={styles.categoryContainer}>
//             <Text style={styles.categoryTitle}>{category.title}</Text>
//             {category.items.map((item) => (
//               <ChecklistItemComponent
//                 key={item.id}
//                 item={item}
//                 onToggle={() => toggleItemCompleted(quest.id, category.title, item.id)}
//               />
//             ))}
//           </View>
//         )}
//         ListHeaderComponent={
//           <View style={styles.headerContainer}>
//             <Text style={styles.progressText}>Overall Progress: {progress}%</Text>
//             <View style={styles.progressBarContainer}>
//               <View style={[styles.progressBar, { width: `${progress}%` }]} />
//             </View>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </SafeAreaView>
//   );
// }

// // Styles are the same as your old kit-checklist.tsx file
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
//   listContent: { padding: 20 },
//   headerContainer: { marginBottom: 20 },
//   progressText: { fontSize: 16, fontWeight: '600', color: '#34495e', marginBottom: 8 },
//   progressBarContainer: {
//     height: 12,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 6,
//     overflow: 'hidden',
//   },
//   progressBar: { height: '100%', backgroundColor: '#27ae60' },
//   categoryContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//   },
//   categoryTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 8,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   itemText: {
//     fontSize: 16,
//     marginLeft: 12,
//     color: '#34495e',
//     flex: 1,
//   },
//   itemTextCompleted: {
//     textDecorationLine: 'line-through',
//     color: '#bdc3c7',
//   },
// });
