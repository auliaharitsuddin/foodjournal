import React, { useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { lookupBarcode } from '@/lib/openFoodFacts';
import { safeBack } from '@/lib/nav';

export default function ScanBarcode() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ mealType?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const scannedRef = useRef(false);

  const onScanned = async (result: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setNotFound(false);
    const food = await lookupBarcode(result.data);
    setLoading(false);
    if (!food) {
      setNotFound(true);
      setTimeout(() => {
        scannedRef.current = false;
      }, 1500);
      return;
    }
    router.replace({
      pathname: '/food/[id]',
      params: {
        id: food.id,
        mealType: params.mealType ?? 'snack',
        name: food.name,
        emoji: food.emoji,
        cal: String(food.caloriesPer100g),
        protein: String(food.proteinPer100g),
        carbs: String(food.carbsPer100g),
        fat: String(food.fatPer100g),
        servingG: String(food.defaultServingG),
        servingLabel: food.servingLabel,
      },
    });
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.xl, justifyContent: 'center' }}>
        <Text style={{ fontSize: 44, textAlign: 'center', marginBottom: spacing.md }}>📷</Text>
        <Text style={[type.title2, { color: colors.label, textAlign: 'center', marginBottom: spacing.sm }]}>
          Izin Kamera Diperlukan
        </Text>
        <Text style={[type.body, { color: colors.labelSecondary, textAlign: 'center', marginBottom: spacing.xl }]}>
          Untuk memindai barcode kemasan makanan, aplikasi butuh akses kamera.
        </Text>
        <Button title="Izinkan Kamera" onPress={requestPermission} />
        <View style={{ height: spacing.md }} />
        <Button title="Batal" variant="secondary" onPress={safeBack} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'] }}
        onBarcodeScanned={onScanned}
      />
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg }}>
          <PressableScale
            onPress={safeBack}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </PressableScale>
          <Text style={[type.headline, { color: '#fff' }]}>Scan Barcode</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View style={{ position: 'absolute', top: '35%', left: '15%', right: '15%', height: '20%', borderWidth: 2, borderColor: colors.blue, borderRadius: radius.lg }} />

      <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center' }}>
        {loading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(0,0,0,0.6)', padding: spacing.md, borderRadius: radius.md }}>
            <ActivityIndicator color="#fff" />
            <Text style={{ color: '#fff' }}>Mencari produk...</Text>
          </View>
        )}
        {notFound && !loading && (
          <View style={{ backgroundColor: 'rgba(255,59,48,0.9)', padding: spacing.md, borderRadius: radius.md, marginHorizontal: spacing.xl }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Produk tidak ditemukan. Coba barcode lain atau cari manual.</Text>
          </View>
        )}
        {!loading && !notFound && (
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Arahkan kamera ke barcode produk</Text>
        )}
      </View>
    </View>
  );
}
