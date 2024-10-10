function RadioPair({
  legend,
  name,
  defaultChecked,
}: {
  legend: string;
  name: string;
  defaultChecked: string;
}) {
  return (
    <>
      <legend className="text-sm font-semibold leading-6 text-gray-900">
        {legend}
      </legend>
      <div className="grid grid-cols-2 items-center">
        <div className="inline-flex items-center gap-x-3">
          <input
            id={`${name}-yes`}
            name={name}
            type="radio"
            className="mt-6 h-4 w-4 border-gray-300 text-yellow-700 focus:ring-yellow-700"
            defaultChecked={defaultChecked === "yes"}
            value="yes"
          />
          <label
            htmlFor={`${name}-yes`}
            className="pt-6 block flex-grow text-sm font-medium leading-6 text-gray-900"
          >
            Yes
          </label>
        </div>
        <div className="flex items-center gap-x-3">
          <input
            id={`${name}-no`}
            name={name}
            type="radio"
            value="no"
            className="mt-6 h-4 w-4 border-gray-300 text-yellow-700 focus:ring-yellow-700"
            defaultChecked={defaultChecked === "no"}
          />
          <label
            htmlFor={`${name}-no`}
            className="pt-6 block flex-grow text-sm font-medium leading-6 text-gray-900"
          >
            No
          </label>
        </div>
      </div>
    </>
  );
}

export default RadioPair;
