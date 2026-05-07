import { Text, View } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View className="gap-1">
      <Text className="text-2xl font-bold text-neutral-900">{title}</Text>
      {subtitle ? <Text className="text-base text-primary-dark">{subtitle}</Text> : null}
    </View>
  );
}
