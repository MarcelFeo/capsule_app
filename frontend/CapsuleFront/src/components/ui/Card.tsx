import { ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`rounded-lg border border-neutral-300 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </View>
  );
}
