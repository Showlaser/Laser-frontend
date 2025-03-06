import React from "react";

type Props = {
  onTrue: boolean;
  children: React.ReactNode;
};

export const OnTrue: React.FC<Props> = ({ onTrue, children }) => <>{onTrue ? children : null}</>;
