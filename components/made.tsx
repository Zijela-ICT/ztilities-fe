// // Map filter options to the format expected by react-select
// const mappedOptions =
//   filter?.options?.map((option) => ({
//     value: option.id,
//     label:
//       (option.firstName && option.lastName
//         ? `${option.firstName} ${option.lastName}`
//         : option.name) || "",
//   })) || [];

// // Find the selected option based on your current filters value
// const selectedOption = mappedOptions.find(
//   (option) => option.value === filters[filter.label]?.id
// );

// <div className="relative w-full mt-6">
//   <Select
//     options={mappedOptions}
//     value={selectedOption}
//     onChange={(selected) => {
//       handleFilterChange(filter.label, selected?.value);
//       setTransactionId(selected?.value);
//       setEntity(filter.label);
//     }}
//     placeholder={`Filter by ${filter.label}`}
//     styles={multiSelectStyle}
//     isClearable
//     required
//   />
// </div>;
