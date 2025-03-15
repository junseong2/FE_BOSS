export default function Input({ onChange, className, value, type, id }) {
  return (
    <input
      id={id}
      type={type}
      onChange={onChange}
      className={`${className} text-[13.2px] border px-3 py-1 rounded-[5px] border-[#E4E4E7] w-full`}
      defaultValue={value}
    ></input>
  );
}
