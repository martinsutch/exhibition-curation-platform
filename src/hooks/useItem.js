import { useQuery } from "@tanstack/react-query";

const fetchItem = async (artPath) => {
  const source = artPath.slice(0, 3);
  const id = artPath.slice(3);

  if (source === "VAM") {
    const res = await fetch(`https://api.vam.ac.uk/v2/museumobject/${id}`);
    const data = await res.json();
    return {
      id: data.record?.systemNumber || "Unknown",
      title: data.record?.titles?.[0]?.title || "Unknown",
      creator: data.record?.artistMakerPerson?.[0]?.name?.text || "Unknown",
      type: data.record?.objectType || "Unknown",
      location: data.record?.placesOfOrigin?.[0]?.place?.text || "Unknown",
      period: data.record?.productionDates?.[0]?.date?.text || "Unknown",
      smallImage:
        data.meta?.images?._primary_thumbnail?.replace(
          "!100,100",
          "!300,300"
        ) || "",
      fullImage:
        data.meta?.images?._primary_thumbnail?.replace("!100,100", "full") ||
        "",
      source: "VAM",
      repository: "Victoria and Albert Museum",
    };
  } else if (source === "MET") {
    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
    );
    const item = await res.json();
    return {
      id: item.objectID,
      title: item.title || "Unknown",
      creator: item.artistDisplayName || "Unknown",
      type: item.objectName || "Unknown",
      location: item.country || "Unknown",
      period: item.objectDate || "Unknown",
      smallImage: item.primaryImageSmall || "",
      fullImage: item.primaryImage || "",
      source: "MET",
      repository: "The Metropolitan Museum of Art",
    };
  } else {
    throw new Error("Invalid artPath source");
  }
};

export const useItem = (artPath) => {
  return useQuery({
    queryKey: ["item", artPath],
    queryFn: () => fetchItem(artPath),
    enabled: !!artPath,
  });
};
