export default function Label({ className, label, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={`${className} text-[13.5px]`}>
      {label}
    </label>
  );
}
