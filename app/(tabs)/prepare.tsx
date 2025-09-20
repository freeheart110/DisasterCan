// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Link } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useQuestStore } from '../../src/state/questStore';
// import type { Quest } from '../../src/constants/quests/types';

// // A reusable component for displaying a single quest card
// const QuestCard = ({ quest }: { quest: Quest }) => {
//   const getQuestProgress = useQuestStore(state => state.getQuestProgress);
//   const progress = getQuestProgress(quest.id);

//   return (
//     <Link href={`/quests/${quest.id}`} asChild>
//       <TouchableOpacity style={styles.questCard}>
//         <View>
//           <Text style={styles.questTitle}>{quest.title}</Text>
//           <Text style={styles.questProgress}>{progress}% Complete</Text>
//         </View>
//         <Ionicons name="chevron-forward" size={24} color="#3498db" />
//       </TouchableOpacity>
//     </Link>
//   );
// };

// export default function PrepareScreen(): React.JSX.Element {
//   const quests = useQuestStore(state => state.quests);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <Text style={styles.header}>Preparedness Quests</Text>
//         <Text style={styles.subHeader}>Complete these quests to become more resilient.</Text>

//         <FlatList
//           data={quests}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => <QuestCard quest={item} />}
//           contentContainerStyle={{ gap: 16 }}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
//   container: { flex: 1, padding: 20 },
//   header: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50' },
//   subHeader: { fontSize: 16, color: '#7f8c8d', marginBottom: 24 },
//   questCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   questTitle: { fontSize: 18, fontWeight: '600', color: '#34495e' },
//   questProgress: { fontSize: 14, color: '#27ae60', marginTop: 4 },
// });
