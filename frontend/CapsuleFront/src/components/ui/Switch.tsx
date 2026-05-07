import { Switch as NativeSwitch, Text, View } from 'react-native';

type SwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function Switch({ label, value, onValueChange }: SwitchProps) {
  return (
    <View className="flex-row items-center justify-between rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3">
      <Text className="text-base font-medium text-neutral-800">{label}</Text>
      <NativeSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E2D9', true: '#DDECE0' }}
        thumbColor={value ? '#739E82' : '#FAF9F6'}
      />
    </View>
  );
}
