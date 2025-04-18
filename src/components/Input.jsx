export default function Input({ onChange, className, value, type, id, name }) {
  return (
    <input
      id={id}
      type={type}
      name={name}
      onChange={onChange}
      className={`${className} text-[13.2px] border px-3 py-1 rounded-[5px] border-[#E4E4E7] w-full`}
      value={value} 
    />
  );
}
