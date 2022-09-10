export const useDisableClick = (hooks) => {
  hooks.prepareRow.push((passedProps, { instance }) => {
    let newProps = { ...passedProps };
  });
  /*
  hooks.getRowProps.push((passedProps, { row }) => {
    let newProps = { ...passedProps };
    if (row.original.disabled) {
      newProps.onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    }
    return newProps;
  });

  hooks.getToggleRowSelectedProps.push((passedProps) => {
    let newProps = { ...passedProps };
    newProps.disabled = true;
    newProps.readonly = true;
    return newProps;
  });*/
};

useDisableClick.pluginName = "useDisableClick";
