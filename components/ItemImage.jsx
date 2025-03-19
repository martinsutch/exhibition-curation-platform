const ItemImage = ({ item }) => {
  return (
    <div className="block column">
      {item?.fullImage ? (
        <img className="resultBlock" src={item.fullImage} alt={item.title} />
      ) : item?.smallImage ? (
        <img className="resultBlock" src={item.smallImage} alt={item.title} />
      ) : null}
    </div>
  );
};

export default ItemImage;
