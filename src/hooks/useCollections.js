import { useQuery } from "@tanstack/react-query";

const fetchFromVAM = async (searchTerm, page) => {
  const res = await fetch(
    `https://api.vam.ac.uk/v2/objects/search?q=${searchTerm}&images_exist=1&page_size=15&page=${page}`
  );
  const data = await res.json();
  return (data.records || []).map((item) => ({
    id: item.systemNumber,
    title: item._primaryTitle || "Unknown",
    creator: item._primaryMaker?.name || "Unknown",
    type: item.objectType || "Unknown",
    location: item._primaryPlace || "Unknown",
    period: item._primaryDate || "Unknown",
    smallImage:
      item._images?._primary_thumbnail.replace("!100,100", "!300,300") || "",
    fullImage:
      item._images?._primary_thumbnail.replace("!100,100", "full") || "",
    source: "VAM",
  }));
};

let logSearchTerm = "";
const metPageIndex = [];

const fetchFromMet = async (searchTerm, page) => {
  const res = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchTerm}`
  );
  const data = await res.json();
  if (!data.objectIDs) return [];

  const objectIDs = data.objectIDs;
  const details = [];

  if (searchTerm !== logSearchTerm) {
    metPageIndex.length = 0;
    logSearchTerm = searchTerm;
  }

  const startIndex = metPageIndex[page - 2] || 0;

  for (let i = startIndex; i < objectIDs.length; i++) {
    const objRes = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`
    );
    const item = await objRes.json();

    if (item.primaryImage) {
      details.push({
        id: item.objectID,
        title: item.title || "Unknown",
        creator: item.artistDisplayName || "Unknown",
        type: item.objectName || "Unknown",
        location: item.country || "Unknown",
        period: item.objectDate || "Unknown",
        smallImage: item.primaryImageSmall || "",
        fullImage: item.primaryImage || "",
        source: "MET",
      });
    }
    if (details.length === 15) {
      metPageIndex[page - 1] = i + 1;
      break;
    }
  }
  if (details.length < 15) {
    metPageIndex[page - 1] = objectIDs.length + 1;
  }
  return details;
};

const fetchCollections = async (searchTerm, page = 1) => {
  const [vam, met] = await Promise.all([
    fetchFromVAM(searchTerm, page),
    fetchFromMet(searchTerm, page),
  ]);
  return [...met, ...vam];
};

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
    };
  } else {
    throw new Error("Invalid artPath source");
  }
};

export const useCollections = (searchTerm, page = 1) => {
  return useQuery({
    queryKey: ["collections", searchTerm, page],
    queryFn: () => fetchCollections(searchTerm, page),
    enabled: !!searchTerm,
  });
};

export const useItem = (artPath) => {
  return useQuery({
    queryKey: ["item", artPath],
    queryFn: () => fetchItem(artPath),
    enabled: !!artPath,
  });
};
