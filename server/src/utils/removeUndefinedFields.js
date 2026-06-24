function removeUndefinedFields(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}

export default removeUndefinedFields;
