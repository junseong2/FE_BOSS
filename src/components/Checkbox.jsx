export default function Checkbox({ name, id, className, onChange }) {
  return (
    <div className=''>
      <input type='checkbox' name={name} id={id} className={`${className}`} onChange={onChange} />
    </div>
  );
}
