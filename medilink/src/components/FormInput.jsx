export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false
}) {
  return (
    <div className="form-group">
      <label>
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
