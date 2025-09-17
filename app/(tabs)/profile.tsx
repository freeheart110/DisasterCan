import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
      <View style={styles.card}>
        <Text style={styles.label}>Level:</Text>
        <Text style={styles.value}>{profile.level}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>XP:</Text>
        <Text style={styles.value}>{profile.xp}</Text>
      </View>

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

      <View style={styles.card}>
        <Text style={styles.label}>Completed Quests:</Text>
        {Object.keys(profile.completedQuests).length === 0 ? (
          <Text style={styles.subText}>No quests completed yet.</Text>
        ) : (
          Object.entries(profile.completedQuests).map(([questId, questData]) => (
            <View key={questId} style={styles.quest}>
              <Text style={styles.questTitle}>📘 {questId}</Text>
              {Object.entries(questData.completedItems).map(([categoryId, items]) => (
                <Text key={categoryId} style={styles.subText}>
                  {categoryId}: {items.length} items
                </Text>
              ))}
            </View>
          ))
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