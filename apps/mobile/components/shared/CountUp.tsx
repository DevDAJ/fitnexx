import { useEffect, useRef } from "react";
import { Text, type TextProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface CountUpProps extends TextProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function CountUp({
  value,
  duration = 800,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
  ...props
}: CountUpProps) {
  const sv = useSharedValue(0);
  const prevValue = useRef(0);

  useEffect(() => {
    sv.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    prevValue.current = value;
  }, [value, duration, sv]);

  const animatedProps = useAnimatedProps(() => {
    const display = sv.value.toFixed(decimals);
    return { text: `${prefix}${display}${suffix}` } as any;
  });

  return (
    <AnimatedText
      animatedProps={animatedProps}
      style={style}
      {...props}
    />
  );
}
