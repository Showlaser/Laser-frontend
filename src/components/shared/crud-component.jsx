import {
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

export default function CrudComponent(props) {
  const { selectOptions, itemsArray, actions, changesSaved } = props;

  return (
    <div>
      <InputLabel id="demo-simple-select-label">
        {selectOptions?.selectText}
      </InputLabel>
      <Select
        onChange={(e) => selectOptions.onChange(e.target.value)}
        value={selectOptions?.selectedValue}
        labelId="demo-simple-select"
        id="demo-simple-select"
      >
        {itemsArray.length > 0
          ? itemsArray?.map((item, index) => (
              <MenuItem key={"options" + item.uuid + index} value={index}>
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
      <div style={{ float: "right" }}>
        {changesSaved ? (
          <p>Changes saved</p>
        ) : (
          <p style={{ color: "red" }}>Changes not saved</p>
        )}
      </div>
    </div>
  );
}