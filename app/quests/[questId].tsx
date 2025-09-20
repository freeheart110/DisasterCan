/**
 * @file [questId].tsx
 * @description Screen to display and interact with a specific quest (checklist or quiz format).
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useQuestStore } from '../../src/state/questStore';
import type { ChecklistItem, QuizQuestion, Quest } from '../../src/constants/quests/questConfig';
import { PointPopUp } from '../../src/components/PointPopUp';
import CompleteCelebration from '../../src/components/CompleteCelebration';

/**
 * UI component for a single checklist item.
 * Shows checkbox, text, and expiry info if completed.
 */
const ChecklistItemComponent = ({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void;
}) => {
  let expiryText = '';

  // 🔍 DEBUG: Log to check if expiryDays is attached
  useEffect(() => {
    if (item.completed) {
      console.log('✅ DEBUG: Checked item', item.id, {
        completedAt: item.completedAt,
        expiryDays: item.expiryDays,
      });
    }
  }, [item.completed]);
  

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
        {expiryText !== '' && (
          <Text style={styles.expiryText}>{expiryText}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Quiz component for quiz quests.
 * Handles answer selection, scoring, and feedback display.
 */
const QuizComponent = ({ questions }: { questions: QuizQuestion[] }) => {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number, answer: string) => {
    if (!submitted) {
      setSelected((prev) => ({ ...prev, [index]: answer }));
    }
  };

  const score = questions.reduce((acc, q, idx) => {
    return acc + (selected[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <View style={styles.quizContainer}>
      {questions.map((q, idx) => (
        <View key={idx} style={styles.quizCard}>
          <Text style={styles.question}>{q.question}</Text>
          {q.options.map((opt, optIdx) => {
            const isSelected = selected[idx] === opt;
            const isCorrect = submitted && opt === q.correctAnswer;
            const isWrong = submitted && isSelected && opt !== q.correctAnswer;

            return (
              <TouchableOpacity
                key={optIdx}
                onPress={() => handleSelect(idx, opt)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong
                ]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {!submitted ? (
        <TouchableOpacity style={styles.submitBtn} onPress={() => setSubmitted(true)}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.score}>You got {score} / {questions.length} correct</Text>
      )}
    </View>
  );
};

/**
 * Main screen to render a specific quest (by ID).
 * Supports both checklist and quiz quest types.
 */
export default function QuestDetailScreen(): React.JSX.Element {
  const router = useRouter();
  const { questId } = useLocalSearchParams<{ questId: string }>();

  const quests = useQuestStore(state => state.quests);
  const isLoading = useQuestStore(state => state.isLoading);
  const toggleItemCompleted = useQuestStore(state => state.toggleItemCompleted);
  const userProfile = useQuestStore(state => state.userProfile);

  const [popUps, setPopUps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasAwardedBonus, setHasAwardedBonus] = useState(false);
  const [wasPreviouslyComplete, setWasPreviouslyComplete] = useState(false);

  const quest: Quest | undefined = quests.find(q => q.id === questId);

  const showPointPopUp = (value: number) => {
    setPopUps((prev) => [...prev, value]);
    setTimeout(() => setPopUps((prev) => prev.slice(1)), 1000);
  };

  const handleToggleItem = (categoryTitle: string, item: ChecklistItem) => {
    const wasCompleted = item.completed;
    toggleItemCompleted(userProfile!.userId, quest!.id, categoryTitle, item.id);
    showPointPopUp(wasCompleted ? -1 : 1);
  };

  useEffect(() => {
    if (quest?.format === 'checklist' && quest.categories) {
      const allItems = quest.categories.flatMap(cat => cat.items);
      const allCompleted = allItems.every(item => item.completed);

      if (allCompleted && !wasPreviouslyComplete) {
        setShowCelebration(true);
        showPointPopUp(5); // Bonus
        setWasPreviouslyComplete(true);
      }

      if (!allCompleted && wasPreviouslyComplete) {
        setWasPreviouslyComplete(false);
      }
    }
  }, [quest]);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!quest || !userProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Error: Quest not found or profile not loaded.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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

      {/* 🎉 Confetti Celebration */}
      {showCelebration && (
        <CompleteCelebration
          message="🎉 +5 Points for finishing the checklist!"
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {/* Floating +1/-1 popups */}
      {popUps.map((value, index) => (
        <PointPopUp key={index} value={value} />
      ))}

      {/* Checklist View */}
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

      {/* Quiz View */}
      {quest.format === 'quiz' && quest.quiz && (
        <QuizComponent questions={quest.quiz.questions} />
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