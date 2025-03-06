import * as React from "react";
import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

type Item = {
  uuid: string;
  name: string;
  description?: string;
};

type SelectListProps = {
  items: Item[];
  disabled?: boolean;
  onSelect: (uuidCollection: string[]) => void;
  style?: any;
  unCheckedCustomIcon?: any;
  checkedCustomIcon?: any;
};

export default function SelectList({
  items,
  disabled,
  onSelect,
  style,
  unCheckedCustomIcon,
  checkedCustomIcon,
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
    <List style={style}>
      {items.map((item) => (
        <ListItem key={item.uuid} disablePadding>
          <ListItemButton disabled={disabled} role={undefined} onClick={handleToggle(item.uuid)} dense>
            <ListItemIcon>
              <Checkbox
                icon={unCheckedCustomIcon ?? <CheckBoxOutlineBlankIcon />}
                checkedIcon={checkedCustomIcon ?? <CheckBoxIcon />}
                edge="start"
                checked={checked.some((c) => c === item.uuid)}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": `checkbox-list-label-${item.uuid}`,
                }}
              />
            </ListItemIcon>
            <ListItemText id={`checkbox-list-label-${item.uuid}`} primary={item.name} secondary={item?.description} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : null;
}
