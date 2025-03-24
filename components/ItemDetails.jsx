const ItemDetails = ({ item }) => {
  return (
    <div className="block column single">
      {item ? (
        <>
          <h2>{item.title}</h2>
          <span>by {item.creator}</span>
          <div className="inputRow">
            <span className="otherLabel bold">Type</span>
            <span>{item.type}</span>
          </div>
          <div className="inputRow">
            <span className="otherLabel bold">Location</span>
            <span>{item.location}</span>
          </div>
          <div className="inputRow">
            <span className="otherLabel bold">Period</span>
            <span>{item.period}</span>
          </div>
          <div className="inputRow">
            <span className="otherLabel bold">Repository</span>
            <span>{item.repository}</span>
          </div>
          <div className="inputRow">
            <span className="otherLabel bold">Repository ID Number</span>
            <span>{item.id}</span>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemDetails;
