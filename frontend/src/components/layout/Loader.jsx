const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const spinner = <div className={`spinner ${sizeClass}`} />;
  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white dark:bg-gray-950">
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default Loader;
