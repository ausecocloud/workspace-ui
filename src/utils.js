
export default
function action(type, error = false) {
  return (payload, metadata) => ({
    type, payload, error, metadata,
  });
}

