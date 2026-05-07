import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
};

const variants = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  ghost: 'bg-transparent border border-neutral-300',
  danger: 'bg-status-error',
};

const textVariants = {
  primary: 'text-white',
  secondary: 'text-neutral-900',
  ghost: 'text-primary-dark',
  danger: 'text-white',
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className={`min-h-12 items-center justify-center rounded-lg px-5 ${variants[variant]} ${
        isDisabled ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? '#4D6B57' : '#FFFFFF'} />
      ) : (
        <Text className={`text-base font-semibold ${textVariants[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
