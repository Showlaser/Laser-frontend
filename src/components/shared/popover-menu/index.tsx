import * as React from "react";
import { Select } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => <Select>{children}</Select>;
