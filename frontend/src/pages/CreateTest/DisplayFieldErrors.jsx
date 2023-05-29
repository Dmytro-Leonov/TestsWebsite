const DisplayFieldErrors = ({errors = []}) => {
  return (
    <>
      {errors.length !== 0 && (
        <div className="flex flex-col">
          {errors.map((error, index) => (
            <span key={index} className="w-full text-red-500">
              * {error}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default DisplayFieldErrors;
