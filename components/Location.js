// import axios from "axios";

// export const PATHS_LOCAL = {
//   CITIES: "./locations/cities.json",
//   DISTRICTS: "./locations/districts",
//   WARDS: "./locations/wards",
//   LOCATION: "./locations/location.json",
// };

// const FETCH_TYPES = {
//   CITIES: "FETCH_CITIES",
//   DISTRICTS: "FETCH_DISTRICTS",
//   WARDS: "FETCH_WARDS",
// };

// async function fetchLocationOptions(fetchType, locationId) {
//   let url;
//   switch (fetchType) {
//     case FETCH_TYPES.CITIES: {
//       url = "./locations/cities.json";
//       console.log(url)
//       break;
//     }
//     case FETCH_TYPES.DISTRICTS: {
//       url = `${PATHS_LOCAL.DISTRICTS}/${locationId}.json`;
//       console.log(url)
//       break;
//     }
//     case FETCH_TYPES.WARDS: {
//       url = `${PATHS_LOCAL.WARDS}/${locationId}.json`;
//       break;
//     }
//     default:
//       break;
//   }

//   const locations = await import(url).data;
//   return locations?.map(({ id, name }) => ({ value: id, label: name }));
// }

// export async function getLocation(cityCode, districtCode, wardCode) {
//   const [cities, districts, wards] = await ([
//     fetchLocationOptions(FETCH_TYPES.CITIES),
//     fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityCode ? cityCode : 0),
//     fetchLocationOptions(FETCH_TYPES.WARDS, districtCode ? districtCode : 0),
//   ]);

//   return {
//     city: cities?.find((e) => e.value === cityCode).label,
//     district: districts?.find((e) => e.value === districtCode).label,
//     ward: wards?.find((e) => e.value === wardCode).label,
//   };
// }
