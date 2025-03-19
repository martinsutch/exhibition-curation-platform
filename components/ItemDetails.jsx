const ItemDetails = ({ item }) => {
  return (
    <div className="block column single">
      {item ? (
        <>
          <span>Item details</span>
          <p>
            {item.title} ({item.id})
          </p>
          <p>
            {item.type} by {item.creator}
          </p>
          <p>
            {item.location} {item.period}
          </p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ItemDetails;
