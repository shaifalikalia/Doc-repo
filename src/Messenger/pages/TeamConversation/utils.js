export const getFullName = (data) => {
  const { name, firstName, lastName } = data || {};
  if (name) {
    return name;
  }
  if (firstName || lastName) {
    return `${firstName} ${lastName}`;
  }
};

export const inBytes = (inMbs) => inMbs * 1024 * 1024;
