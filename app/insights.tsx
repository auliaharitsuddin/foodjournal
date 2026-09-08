import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { buildKnowledgeGraph, describeGraph } from '@/lib/knowledgeGraph';
import { getFoodRecommendation } from '@/lib/gemini';
import { safeBack } from '@/lib/nav';

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.round(hours / 24)} hari lalu`;
}

export default function Insights() {
  const { colors } = useTheme();
  const { state, setAiRecommendation } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const graph = useMemo(() => buildKnowledgeGraph(state), [state]);
  const insightList = useMemo(() => describeGraph(graph, 10), [graph]);
  const hasEnoughData = state.meals.length >= 5;

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await getFoodRecommendation(state);
      setAiRecommendation(text);
    } catch (e: any) {
      setError(e?.message ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.sm }}>
        <PressableScale
          onPress={safeBack}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.label} />
        </PressableScale>
        <Text style={[type.title2, { color: colors.label }]}>Insight & Rekomendasi</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.md }]}>Rekomendasi AI</Text>
        <Card style={{ marginBottom: spacing.xl }}>
          {state.aiRecommendation ? (
            <>
              <Text style={[type.body, { color: colors.label, marginBottom: spacing.sm }]}>{state.aiRecommendation.text}</Text>
              <Text style={[type.caption1, { color: colors.labelTertiary, marginBottom: spacing.md }]}>
                Diperbarui {timeAgo(state.aiRecommendation.generatedAt)}
              </Text>
            </>
          ) : (
            <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.md }]}>
              Dapatkan rekomendasi pola makan & kesehatan dari Gemini AI berdasarkan data makan dan berat badanmu. Data makan &
              berat badanmu akan dikirim ke Gemini API untuk membuat rekomendasi ini.
            </Text>
          )}
          {error && <Text style={[type.footnote, { color: colors.red, marginBottom: spacing.md }]}>{error}</Text>}
          <Button
            title={loading ? 'Memuat...' : state.aiRecommendation ? 'Perbarui Rekomendasi' : 'Dapatkan Rekomendasi'}
            onPress={fetchRecommendation}
            disabled={loading}
          />
        </Card>

        <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.md }]}>Pola yang Ditemukan</Text>
        {!hasEnoughData ? (
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>🔍</Text>
            <Text style={[type.subhead, { color: colors.labelSecondary, textAlign: 'center' }]}>
              Catat minimal 5 makanan untuk mulai menemukan pola.
            </Text>
          </Card>
        ) : (
          <Card style={{ gap: spacing.md }}>
            {insightList.map((insight, i) => (
              <View key={i}>
                <Text style={[type.subhead, { color: colors.label, marginBottom: spacing.xs }]}>{insight.label}</Text>
                <View style={{ height: 6, backgroundColor: colors.fill, borderRadius: radius.pill, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.min((insight.weight / (insightList[0]?.weight || 1)) * 100, 100)}%`,
                      backgroundColor: colors.indigo,
                    }}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
