import { Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-neutral-800">{label}</Text>
      <TextInput
        placeholderTextColor="#739E82"
        className={`min-h-12 rounded-lg border border-neutral-300 bg-neutral-200 px-4 text-base text-neutral-900 ${className}`}
        {...props}
      />
      {error ? <Text className="text-sm text-status-error">{error}</Text> : null}
    </View>
  );
}
