import React, { ReactNode } from "react";
import { useTheme } from "../../hooks";
import { SectionContainer } from "../section-container";
import Text from "../text";
import { styles } from "./styles";

type Props = {
  title: string;
  value?: string | number;
  children?: ReactNode;
};

const InfoFieldComp: React.FC<Props> = ({ title, value, children }) => {
  const { AppTheme } = useTheme();
  return (
    <SectionContainer containerStyles={styles.container}>
      <Text bold size={14} color={AppTheme.Black}>
        {title}
      </Text>
      {children && children}
      {value && (
        <SectionContainer
          containerStyles={{
            ...styles.valueContainer,
            backgroundColor: AppTheme.White,
          }}
        >
          <Text bold size={12} color={AppTheme.fontGray}>
            {value}
          </Text>
        </SectionContainer>
      )}
    </SectionContainer>
  );
};

export default InfoFieldComp;
