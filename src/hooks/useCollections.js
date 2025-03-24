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
    type: item.objectType
      ? item.objectType
          .split(",")[0]
          .trim()
          .replace(/^./, (char) => char.toUpperCase())
      : "Unknown",
    location: item._primaryPlace || "Unknown",
    period: item._primaryDate || "Unknown",
    smallImage:
      item._images?._primary_thumbnail.replace("!100,100", "!300,300") || "",
    fullImage:
      item._images?._primary_thumbnail.replace("!100,100", "full") || "",
    source: "VAM",
    repository: "Victoria and Albert Museum",
  }));
};

let loggedSearchTerm = "";
const metPageIndex = [];

const fetchFromMet = async (searchTerm, page) => {
  const res = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchTerm}`
  );
  const data = await res.json();
  if (!data.objectIDs) return [];

  const objectIDs = data.objectIDs;
  const details = [];

  if (searchTerm !== loggedSearchTerm) {
    metPageIndex.length = 0;
    loggedSearchTerm = searchTerm;
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
        type: item.objectName
          ? item.objectName
              .split(",")[0]
              .trim()
              .replace(/^./, (char) => char.toUpperCase())
          : "Unknown",
        location: item.country || "Unknown",
        period: item.objectDate || "Unknown",
        smallImage: item.primaryImageSmall || "",
        fullImage: item.primaryImage || "",
        source: "MET",
        repository: "The Metropolitan Museum of Art",
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
  const met = await fetchFromMet(searchTerm, page);
  const vam = await fetchFromVAM(searchTerm, page);
  return [...met, ...vam];
};

export const useCollections = (searchTerm, page = 1) => {
  return useQuery({
    queryKey: ["collections", searchTerm, page],
    queryFn: () => fetchCollections(searchTerm, page),
    enabled: !!searchTerm,
  });
};
