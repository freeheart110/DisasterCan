import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../../src/firebase/config';
import { getUserProfile, UserProfile } from '../../src/services/profileService';

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (auth.currentUser) {
        const data = await getUserProfile(auth.currentUser.uid);
        setProfile(data);
        // console.log('👤 Loaded user profile:', data);
        // console.log('📘 Completed Quests:', data.completedQuests);
        console.log('🏅 Badges:', data.badges);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>No profile data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👤 Your Profile</Text>

      {/* User Level */}
      <View style={styles.card}>
        <Text style={styles.label}>Level:</Text>
        <Text style={styles.value}>{profile.level}</Text>
      </View>

      {/* Total Points */}
      <View style={styles.card}>
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.value}>{profile.point}</Text>
      </View>

      {/* Badges */}
      <View style={styles.card}>
        <Text style={styles.label}>Badges:</Text>
        {profile.badges.length === 0 ? (
          <Text style={styles.subText}>No badges yet. Start exploring!</Text>
        ) : (
          profile.badges.map((badge, index) => (
            <Text key={index} style={styles.badge}>
              🏅 {badge}
            </Text>
          ))
        )}
      </View>

      {/* Completed Quests */}
      <View style={styles.card}>
        <Text style={styles.label}>Completed Quests:</Text>

        {Object.keys(profile.completedQuests).length === 0 ? (
          <Text style={styles.subText}>No quests completed yet.</Text>
        ) : (
          Object.entries(profile.completedQuests).map(([questId, questData]) => {
            const hasChecklist =
              questData.checklistItems &&
              Object.keys(questData.checklistItems).length > 0;
            const hasQuiz = questData.quizCompleted === true;

            if (!hasChecklist && !hasQuiz) return null;

            const title = questData.title || questId;

            return (
              <View key={questId} style={styles.quest}>
                <Text style={styles.questTitle}>📘 {title}</Text>

                {/* Checklist progress */}
                {hasChecklist &&
                  Object.entries(questData.checklistItems!).map(
                    ([categoryId, items]) => (
                      <Text key={categoryId} style={styles.subText}>
                        {categoryId}: {items.length} items
                      </Text>
                    )
                  )}

                {/* Quiz completion */}
                {hasQuiz && (
                  <Text style={styles.subText}>✅ Quiz: Completed</Text>
                )}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  badge: {
    fontSize: 16,
    marginVertical: 2,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
  quest: {
    marginTop: 8,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});