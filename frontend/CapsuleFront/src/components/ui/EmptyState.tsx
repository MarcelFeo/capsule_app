import { Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-200 p-6">
      <Text className="text-center text-base font-semibold text-neutral-800">{title}</Text>
      {description ? <Text className="mt-2 text-center text-sm text-primary-dark">{description}</Text> : null}
    </View>
  );
}
