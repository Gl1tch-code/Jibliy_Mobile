import { Text } from "react-native";

type PropsType = {
  if: boolean;
  children: JSX.Element | string;
};

export default function Show({ children, if: condition }: PropsType) {
  if (condition) {
    return (
      <>{typeof children === "string" ? <Text>{children}</Text> : children}</>
    );
  } else {
    return <></>;
  }
}
