import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import * as React from "react";

type Item = {
  uuid: string | undefined;
  name: string;
  description?: string;
};

type SelectListProps = {
  items: Item[];
  disabled?: boolean;
  onSelect: (uuidCollection: string[]) => void;
  style?: React.CSSProperties;
  unCheckedCustomIcon?: React.ReactNode;
  checkedCustomIcon?: React.ReactNode;
  allowSelectMultiple?: boolean;
};

export default function SelectList({
  items,
  disabled,
  onSelect,
  style,
  unCheckedCustomIcon,
  checkedCustomIcon,
  allowSelectMultiple = true,
}: SelectListProps) {
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (uuid: string | undefined) => () => {
    uuid = uuid ?? "";
    const currentIndex = checked.findIndex((c) => c === uuid);
    const newChecked = [...checked];

    if (!allowSelectMultiple && checked.length > 0) {
      newChecked.splice(currentIndex, 1);

      if (!checked.includes(uuid)) {
        newChecked.push(uuid);
      }
    } else if (currentIndex === -1) {
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
          <ListItemButton
            disabled={disabled}
            role={undefined}
            onClick={handleToggle(item?.uuid)}
            dense
          >
            <ListItemIcon>
              <Checkbox
                icon={unCheckedCustomIcon ?? <CheckBoxOutlineBlankIcon />}
                checkedIcon={checkedCustomIcon ?? <CheckBoxIcon />}
                edge="start"
                checked={checked.some((c) => c === (item.uuid ?? ""))}
                tabIndex={-1}
                disableRipple
                slotProps={{
                  input: { "aria-labelledby": `checkbox-list-label-${item.uuid}` },
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={`checkbox-list-label-${item.uuid}`}
              primary={item.name}
              secondary={item?.description}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : null;
}
