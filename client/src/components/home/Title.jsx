const Title = ({ title, description }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
};

export default Title;
