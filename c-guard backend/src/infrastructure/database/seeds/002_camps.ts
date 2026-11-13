import type { PoolClient } from 'pg';

interface SeedCamp {
  name: string;
  address: string;
  state: string;
  latitude: number;
  longitude: number;
}

// Development seed data covering all 37 NYSC orientation camps (36 states + FCT).
// Addresses are based on the NYSC-sourced nationwide list. Coordinates are
// approximate town-centre values and must be reviewed before operational use.
// Where sources disagree or a camp is temporarily relocated, the primary
// permanent camp is used and the alternate is noted in the address.
const CAMPS: SeedCamp[] = [
  {
    name: 'NYSC Permanent Orientation Camp, Umunna',
    address: 'Umunna, Bende Local Government Area, Abia State',
    state: 'Abia',
    latitude: 5.68,
    longitude: 7.63,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Damare',
    address: 'Lapondo Road, Damare, Girei Local Government Area, Adamawa State',
    state: 'Adamawa',
    latitude: 9.35,
    longitude: 12.5,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Ikot Itie Udung',
    address: 'Ikot Itie Udung, Nsit Atai Local Government Area, Akwa Ibom State',
    state: 'Akwa Ibom',
    latitude: 4.87,
    longitude: 7.95,
  },
  {
    name: 'Nnamdi Azikiwe NYSC Unity Permanent Orientation Camp',
    address: 'Umuawulu/Mbaukwu, Awka South Local Government Area, Anambra State',
    state: 'Anambra',
    latitude: 6.135,
    longitude: 7.096,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Wailo',
    address: 'KM 60 Wailo, Ganjuwa Local Government Council, Bauchi State',
    state: 'Bauchi',
    latitude: 10.42,
    longitude: 9.78,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Boro Town',
    address: 'Boro Town via Kaiama Town, Kolokuma/Opokuma Local Government Area, Bayelsa State',
    state: 'Bayelsa',
    latitude: 5.05,
    longitude: 6.33,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Wannune',
    address: 'Wannune, Tarka Local Government Area, KM 35 Makurdi-Gboko Road, Benue State',
    state: 'Benue',
    latitude: 7.55,
    longitude: 8.83,
  },
  {
    name: 'Mustapha Umar El-Kanemi Arabic Teachers College',
    address: 'Maiduguri, Borno State',
    state: 'Borno',
    latitude: 11.85,
    longitude: 13.15,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Obubra',
    address: 'Obubra, Obubra Local Government Area, Cross River State',
    state: 'Cross River',
    latitude: 6.08,
    longitude: 8.33,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Issele-Uku',
    address: 'Former Martins TTC, Issele-Uku, Aniocha North Local Government Area, Delta State',
    state: 'Delta',
    latitude: 6.32,
    longitude: 6.47,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Afikpo',
    address: 'Macgregor College, Afikpo Local Government Area, Ebonyi State',
    state: 'Ebonyi',
    latitude: 5.89,
    longitude: 7.95,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Okada',
    address: 'Opposite Igbinedion University, Okada, Ovia North East Local Government Area, Edo State',
    state: 'Edo',
    latitude: 6.16,
    longitude: 5.68,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Ise-Orun/Emure',
    address: 'Ise-Orun/Emure Local Government Area, Ekiti State',
    state: 'Ekiti',
    latitude: 7.45,
    longitude: 5.45,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Awgu',
    address: 'Awgu, Awgu Local Government Area, Enugu State',
    state: 'Enugu',
    latitude: 6.07,
    longitude: 7.48,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Kubwa',
    address: 'Kubwa, Bwari Area Council, FCT',
    state: 'FCT',
    latitude: 9.1553,
    longitude: 7.3242,
  },
  {
    name: 'NYSC Temporary Orientation Camp, Amada',
    address: 'Science Technical College, Amada, KM 21 Gombe-Bauchi Highway, Near International Airport, Gombe State',
    state: 'Gombe',
    latitude: 10.2,
    longitude: 11.05,
  },
  {
    name: 'NYSC Temporary Orientation Camp, Eziama Obaire',
    address: "Former Girls' Model Secondary School, Eziama Obaire, Nkwerre Local Government Area, Imo State",
    state: 'Imo',
    latitude: 5.75,
    longitude: 7.1,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Fanisau',
    address: 'Opposite Army Barrack, Fanisau, Dutse Local Government Area, Jigawa State',
    state: 'Jigawa',
    latitude: 11.78,
    longitude: 9.35,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Kurmin Mashi',
    address: 'Government College, Gwamna Road, Kurmin Mashi, Kaduna State',
    state: 'Kaduna',
    latitude: 10.52,
    longitude: 7.44,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Kusala Dam',
    address: 'Kusala Dam, Karaye Local Government Area, Kano State',
    state: 'Kano',
    latitude: 11.76,
    longitude: 8.4,
  },
  {
    name: 'Youth Multi-purpose Centre/NYSC Permanent Orientation Camp, Mani Road',
    address: 'Mani Road, Katsina State',
    state: 'Katsina',
    latitude: 12.95,
    longitude: 7.65,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Dakingari',
    address: 'Dakingari, Suru Local Government Area, Kebbi State',
    state: 'Kebbi',
    latitude: 11.65,
    longitude: 4.25,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Asaya',
    address: 'Asaya, Kabba Local Government Area, Kogi State',
    state: 'Kogi',
    latitude: 7.84,
    longitude: 6.08,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Yikpata',
    address: 'Yikpata, Edu Local Government Area, Kwara State',
    state: 'Kwara',
    latitude: 8.95,
    longitude: 5.4,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Iyana Ipaja',
    address: 'Iyana Ipaja, Agege, Lagos State',
    state: 'Lagos',
    latitude: 6.611,
    longitude: 3.263,
  },
  {
    name: 'Magaji Dan-Yamusa Permanent Orientation Camp',
    address: 'Keffi, Nasarawa State',
    state: 'Nasarawa',
    latitude: 8.85,
    longitude: 7.87,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Paiko',
    address: 'Former Abubakar Dada Senior Secondary School, Paiko, Niger State',
    state: 'Niger',
    latitude: 9.43,
    longitude: 6.63,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Sagamu',
    address: 'Ikenne Road, Sagamu Local Government Area, Ogun State',
    state: 'Ogun',
    latitude: 6.85,
    longitude: 3.65,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Ikare-Akoko',
    address: 'Ikare-Akoko Local Government Area, Ondo State',
    state: 'Ondo',
    latitude: 7.52,
    longitude: 5.75,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Ede',
    address: 'Aisu Junction, Cottage Hospital Road, Ede North Local Government Area, Osun State',
    state: 'Osun',
    latitude: 7.7333,
    longitude: 4.4333,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Iseyin',
    address: 'Government Technical College, Iseyin Local Government Area, Oyo State',
    state: 'Oyo',
    latitude: 7.97,
    longitude: 3.6,
  },
  {
    name: 'NYSC Temporary Orientation Camp, Doi-Du',
    address: 'Waye Foundation by Buken Academy, Doi-Du, Jos South Local Government Area, Plateau State',
    state: 'Plateau',
    latitude: 9.78,
    longitude: 8.8,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Nonwa-Gbam',
    address: 'Nonwa-Gbam, Tai Local Government Area, Rivers State',
    state: 'Rivers',
    latitude: 4.73,
    longitude: 7.35,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Wamakko',
    address: 'Wamakko, Wamakko Local Government Area, Sokoto State',
    state: 'Sokoto',
    latitude: 13.03,
    longitude: 5.1,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Sibre',
    address: 'Sibre Airport Road, Jalingo, Taraba State',
    state: 'Taraba',
    latitude: 8.9,
    longitude: 11.35,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Dazigau',
    address: 'Dazigau, KM 5 Potiskum-Kano Road, Nangere Local Government Area, Yobe State',
    state: 'Yobe',
    latitude: 11.82,
    longitude: 11.0,
  },
  {
    name: 'NYSC Permanent Orientation Camp, Tsafe',
    address: 'Beside FRSC Office, Tsafe Local Government Area, Zamfara State',
    state: 'Zamfara',
    latitude: 11.95,
    longitude: 6.92,
  },
];

export async function seedCamps(client: PoolClient): Promise<void> {
  for (const camp of CAMPS) {
    const updated = await client.query(
      `UPDATE camps
       SET name = $1, address = $2, latitude = $3, longitude = $4
       WHERE lower(state) = lower($5)`,
      [camp.name, camp.address, camp.latitude, camp.longitude, camp.state],
    );

    if (!updated.rowCount) {
      await client.query(
        `INSERT INTO camps (name, address, state, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5)`,
        [camp.name, camp.address, camp.state, camp.latitude, camp.longitude],
      );
    }
  }
}
