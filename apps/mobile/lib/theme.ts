import { useColorScheme } from "nativewind";

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  return {
    background: dark ? "hsl(190, 100%, 17.3%)" : "hsl(0, 0%, 100%)",
    foreground: dark ? "hsl(192, 46.3%, 98.1%)" : "hsl(200, 14.1%, 4.1%)",
    primary: dark ? "hsl(183, 100%, 24.7%)" : "hsl(184, 100%, 28.5%)",
    mutedForeground: dark ? "hsl(192, 17%, 62.9%)" : "hsl(192, 14%, 42.9%)",
    border: dark ? "hsl(200, 2.5%, 35.5%)" : "hsl(192, 23.7%, 89%)",
  };
}
