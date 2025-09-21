import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useQuestStore } from '../../src/state/questStore';
import type { ChecklistItem, QuizQuestion, Quest } from '../../src/constants/quests/questConfig';
import { PointPopUp } from '../../src/components/PointPopUp';
import CompleteCelebration from '../../src/components/CompleteCelebration';
import { awardPointForChecklistItem, awardPointForQuizAnswer } from '../../src/services/gamificationService';
import { getEarnedBadges } from '../../src/services/badgeService';

const ChecklistItemComponent = ({ item, onToggle }: { item: ChecklistItem; onToggle: () => void }) => {
  let expiryText = '';

  if (item.completed && item.completedAt) {
    const now = new Date();
    const completedDate = new Date(item.completedAt);
    const elapsedMs = now.getTime() - completedDate.getTime();
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    const maxDays = item.expiryDays ?? 180;
    const remaining = maxDays - elapsedDays;
    expiryText = `Expires in ${remaining <= 0 ? 0 : remaining} day${remaining === 1 ? '' : 's'}`;
  }

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onToggle}>
      <Ionicons
        name={item.completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={item.completed ? '#27ae60' : '#bdc3c7'}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
          {item.text}
        </Text>
        {expiryText !== '' && <Text style={styles.expiryText}>{expiryText}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const QuizComponent = ({
  questions,
  questId,
  userProfile,
  onScore,
}: {
  questions: QuizQuestion[];
  questId: string;
  userProfile: any;
  onScore: (points: number, bonus: boolean) => void;
}) => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const makeQuizCompleted = useQuestStore((state) => state.makeQuizCompleted);
  const alreadyCompleted = userProfile?.completedQuests?.[questId]?.quizCompleted === true;

  useEffect(() => {
    if (alreadyCompleted) {
      setSubmitted(true);
    }
  }, [alreadyCompleted]);

  const handleSelect = (index: number, answer: string) => {
    if (!submitted && !alreadyCompleted) {
      setSelected((prev) => ({ ...prev, [index]: answer }));
    }
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      const isCorrect = selected[idx] === q.correctAnswer;
      if (isCorrect) score += 1;
    });

    setLocalScore(score);
    setSubmitted(true);

    const fullScore = score === questions.length;
    const shouldAward = !alreadyCompleted;

    if (shouldAward && score > 0) {
      for (let i = 0; i < score; i++) {
        awardPointForQuizAnswer(userProfile.userId, false);
      }
    }

    if (shouldAward && fullScore) {
      const quest = useQuestStore.getState().quests.find((q) => q.id === questId);
      if (quest) {
        makeQuizCompleted(quest);
      }
      awardPointForQuizAnswer(userProfile.userId, true);
    }

    onScore(score, fullScore);
  };

  return (
    <View style={styles.quizContainer}>
      {alreadyCompleted && (
        <Text style={[styles.score, { color: '#999', marginBottom: 12 }]}>✅ You’ve already completed this quiz</Text>
      )}

      {questions.map((q, idx) => {
        const isSubmitted = submitted || alreadyCompleted;
        const userAnswer = selected[idx];
        const isCorrect = isSubmitted && userAnswer === q.correctAnswer;
        const isWrong = isSubmitted && userAnswer && userAnswer !== q.correctAnswer;

        return (
          <View key={idx} style={styles.quizCard}>
            <Text style={styles.question}>{q.question}</Text>
            {q.options.map((opt, optIdx) => {
              const isSelected = userAnswer === opt;
              return (
                <TouchableOpacity
                  key={optIdx}
                  onPress={() => handleSelect(idx, opt)}
                  disabled={isSubmitted}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                    isSubmitted && opt === q.correctAnswer && styles.optionCorrect,
                    isSubmitted && isSelected && opt !== q.correctAnswer && styles.optionWrong,
                  ]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}

      {!submitted && !alreadyCompleted && (
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      )}

      {submitted && !alreadyCompleted && (
        <Text style={styles.score}>
          You got {localScore} / {questions.length} correct
        </Text>
      )}
    </View>
  );
};

export default function QuestDetailScreen(): React.JSX.Element {
  const router = useRouter();
  const { questId } = useLocalSearchParams<{ questId: string }>();
  const quests = useQuestStore((state) => state.quests);
  const isLoading = useQuestStore((state) => state.isLoading);
  const toggleItemCompleted = useQuestStore((state) => state.toggleItemCompleted);
  const userProfile = useQuestStore((state) => state.userProfile);

  const [popUps, setPopUps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedQuests, setCelebratedQuests] = useState<Set<string>>(new Set());
  const [celebrationMessage, setCelebrationMessage] = useState<string>('🎉 +5 Bonus points for finishing the quest!');

  const quest: Quest | undefined = quests.find((q) => q.id === questId);

  const showPointPopUp = (value: number) => {
    setPopUps((prev) => [...prev, value]);
    setTimeout(() => setPopUps((prev) => prev.slice(1)), 1000);
  };

  const handleToggleItem = (categoryTitle: string, item: ChecklistItem) => {
    const wasCompleted = item.completed;
    toggleItemCompleted(userProfile!.userId, quest!.id, categoryTitle, item.id);
    showPointPopUp(wasCompleted ? -1 : 1);
  };

  const handleQuizScore = (points: number, fullScore: boolean) => {
    if (points > 0) showPointPopUp(points);
    if (fullScore) {
      checkBadgeEarned();
      setShowCelebration(true);
      showPointPopUp(5);
    }
  };

  const checkBadgeEarned = () => {
    const profile = useQuestStore.getState().userProfile;
      if (!profile) return;
    const oldBadges = profile?.badges || [];
    const newBadges = getEarnedBadges(profile);
    const newlyEarned = newBadges.filter((badge) => !oldBadges.includes(badge));
    if (newlyEarned.length > 0) {
      setCelebrationMessage(`🎉 +5 bonus Points for finishing this quest and 🏅 Badge Earned: ${newlyEarned[0]} for completing both family plan and 72 hour kit`);
    }
  };

  useEffect(() => {
    if (quest?.format === 'checklist' && quest.categories) {
      const allItems = quest.categories.flatMap((cat) => cat.items);
      const allCompleted = allItems.every((item) => item.completed);
      const alreadyCelebrated = celebratedQuests.has(quest.id);

      if (allCompleted && !alreadyCelebrated) {
        checkBadgeEarned();
        setShowCelebration(true);
        showPointPopUp(5);
        setCelebratedQuests((prev) => new Set(prev).add(quest.id));
      }
    }
  }, [quest]);

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!quest || !userProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Error: Quest not found or profile not loaded.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: quest.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="chevron-back" size={28} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      {showCelebration && (
        <CompleteCelebration
          message={celebrationMessage}
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {popUps.map((value, index) => (
        <PointPopUp key={index} value={value} />
      ))}

      {quest.format === 'checklist' && quest.categories && (
        <FlatList
          data={quest.categories}
          keyExtractor={(category) => category.title}
          renderItem={({ item: category }) => (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              {category.items.map((item) => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  onToggle={() => handleToggleItem(category.title, item)}
                />
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {quest.format === 'quiz' && quest.quiz && (
        <ScrollView contentContainerStyle={styles.quizContainer}>
          <QuizComponent
            questions={quest.quiz.questions}
            questId={quest.id}
            userProfile={userProfile}
            onScore={handleQuizScore}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
  listContent: { padding: 20 },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#34495e',
    flexShrink: 1,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#bdc3c7',
  },
  expiryText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quizContainer: {
    padding: 20,
  },
  quizCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
  },
  optionSelected: {
    backgroundColor: '#d0e6fa',
  },
  optionCorrect: {
    backgroundColor: '#c8e6c9',
  },
  optionWrong: {
    backgroundColor: '#f8d7da',
  },
  optionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  submitBtn: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#27ae60',
  },
});