import PropTypes from "prop-types";
import "./style.scss";

export const FIELD_TYPES = {
  INPUT_TEXT: 1,
  TEXTAREA: 2,
};

const Field = ({ type, label, name, placeholder, ...rest }) => {
  const commonProps = {
    name,
    placeholder,
    "data-testid": "field-testid",
    ...rest,
  };

  let component;
  switch (type) {
    case FIELD_TYPES.TEXTAREA:
      component = <textarea {...commonProps} />;
      break;
    case FIELD_TYPES.INPUT_TEXT:
    default:
      component = <input type="text" {...commonProps} />;
      break;
  }

  return (
    <div className="inputField">
      <span>{label}</span>
      {component}
    </div>
  );
};

Field.propTypes = {
  type: PropTypes.oneOf(Object.values(FIELD_TYPES)),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Field.defaultProps = {
  label: "",
  placeholder: "",
  type: FIELD_TYPES.INPUT_TEXT,
  name: "field-name",
  onChange: undefined,
  onBlur: undefined,
};

export default Field;