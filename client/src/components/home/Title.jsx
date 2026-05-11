
const Title = ({title,description}) => {
  return (
    <div className='text-center mt-6 text-slate-700'>
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      <p className="text-slate-600 mt-2">{description}</p>
    </div>
  )
}

export default Title