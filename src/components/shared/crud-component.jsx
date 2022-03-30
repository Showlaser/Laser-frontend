import {
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CrudComponent({
  selectOptions,
  itemsArray,
  actions,
  changesSaved,
  children,
}) {
  return selectOptions?.selectedValue !== undefined ? (
    <div key={selectOptions.selectedValue + "crud-component"}>
      <InputLabel id="demo-simple-select-label">
        {selectOptions?.selectText}
      </InputLabel>
      <Select
        onChange={(e) => {
          selectOptions.onChange(e.target.value);
        }}
        value={selectOptions?.selectedValue}
        labelId="demo-simple-select"
        id="demo-simple-select"
      >
        {Array.isArray(itemsArray)
          ? itemsArray?.map((item, index) => (
              <MenuItem key={"options" + item.uuid + index} value={item?.uuid}>
                {item?.name}
              </MenuItem>
            ))
          : null}
      </Select>
      <Select value={-1} style={{ marginLeft: "5px" }}>
        <MenuItem value={-1}>
          <em>Actions</em>
        </MenuItem>
        <MenuItem
          value={0}
          key="patterns-select-save"
          onClick={() => actions.onSave()}
        >
          <ListItemIcon>
            <SaveAltIcon />
          </ListItemIcon>
          <ListItemText>Save</ListItemText>
        </MenuItem>
        <MenuItem
          value={1}
          key="patterns-select-add"
          onClick={() => actions.onAdd()}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Add</ListItemText>
        </MenuItem>
        <MenuItem
          value={2}
          key="patterns-select-delete"
          onClick={() => actions.onDelete()}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        {actions?.templates !== undefined ? (
          <MenuItem>
            <Select value={-1}>
              <MenuItem value={-1}>
                <em>Use template</em>
              </MenuItem>
              {actions?.templates?.map((template, index) => (
                <MenuItem
                  key={"templates" + template.name + index}
                  onClick={() => template.getTemplate()}
                >
                  {template?.name}
                </MenuItem>
              ))}
            </Select>
          </MenuItem>
        ) : null}
      </Select>
      {children}
      <div style={{ float: "right" }}>
        {changesSaved ? (
          <p>Changes saved</p>
        ) : (
          <p style={{ color: "red" }}>Changes not saved</p>
        )}
      </div>
    </div>
  ) : null;
}
