    import React, { useState } from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
    import { useQuestStore } from '../../../src/state/questStore';
    import { auth } from '../../../src/firebase/config';
    import { awardPointForQuizAnswer } from '../../../src/services/gamificationService';

    export default function QuizScreen() {
      const { questId } = useLocalSearchParams<{ questId: string }>();
      const quests = useQuestStore(state => state.quests);
      const quest = quests.find(q => q.id === questId);
      const quiz = quest?.quiz;

      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [score, setScore] = useState(0);
      const [showResult, setShowResult] = useState(false);
      const router = useRouter();

      const handleAnswer = async (selectedOption: string) => {
        if (quiz?.questions[currentQuestionIndex].correctAnswer === selectedOption) {
          setScore(score + 1);
          // Award XP for the correct answer
          if (auth.currentUser) {
            await awardPointForQuizAnswer(auth.currentUser.uid);
          }
        }

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < (quiz?.questions.length || 0)) {
          setCurrentQuestionIndex(nextQuestionIndex);
        } else {
          setShowResult(true);
        }
      };

      if (!quiz) {
        return (
          <SafeAreaView style={styles.container}>
            <Text>No quiz available for this quest.</Text>
          </SafeAreaView>
        );
      }

      if (showResult) {
        return (
          <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: 'Quiz Result' }} />
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.resultText}>
              You scored {score} out of {quiz.questions.length}
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Back to Quest</Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
      }

      const currentQuestion = quiz.questions[currentQuestionIndex];

      return (
        <SafeAreaView style={styles.container}>
          <Stack.Screen options={{ headerTitle: quiz.title }} />
          <Text style={styles.question}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
      },
      question: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      },
      optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
      },
      optionText: {
        fontSize: 18,
      },
      resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      resultText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
      },
      button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
      },
    });
    
