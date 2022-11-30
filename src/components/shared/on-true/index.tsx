import React from "react";

type Props = {
  onTrue: boolean;
};

export const OnTrue: React.FC<Props> = ({ onTrue, children }) => <>{onTrue ? children : null}</>;
