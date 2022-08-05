import * as React from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

type Item = {
  uuid: string;
  name: string;
};

type SelectListProps = {
  items: Item[];
  disabled: boolean;
  onSelect: (uuidCollection: string[]) => void;
};

export default function SelectList({
  items,
  disabled,
  onSelect,
}: SelectListProps) {
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (uuid: string) => () => {
    const currentIndex = checked.findIndex((c) => c === uuid);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(uuid);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    onSelect(newChecked);
  };

  return items.length > 0 ? (
    <List>
      {items.map((item) => (
        <ListItem key={item.uuid} disablePadding>
          <ListItemButton
            disabled={disabled}
            role={undefined}
            onClick={handleToggle(item.uuid)}
            dense
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.some((c) => c === item.uuid)}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": `checkbox-list-label-${item.uuid}`,
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={`checkbox-list-label-${item.uuid}`}
              primary={item.name}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : null;
}
