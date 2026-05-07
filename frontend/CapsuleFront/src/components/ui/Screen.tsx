import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
};

export function Screen({ children, scroll = true, className = '' }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          contentContainerClassName={`gap-4 p-5 ${className}`}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 gap-4 p-5 ${className}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
