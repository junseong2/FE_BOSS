// interface PropsType { }

export default function SignUpForm({ children, onSubmit }) {
  return (
    <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  )

}